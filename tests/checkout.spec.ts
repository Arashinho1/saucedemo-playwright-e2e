import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { TEST_DATA } from '../src/data/testData';

test.describe('Fluxo de Compra e Checkout (E2E)', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      TEST_DATA.users.standard.username,
      TEST_DATA.users.standard.password
    );

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await expect(inventoryPage.title).toBeVisible();
  });

  test('Deve realizar o fluxo completo de compra de ponta a ponta com sucesso', async ({ page }) => {
    // 1. Adicionar produto ao catálogo
    await inventoryPage.addProductToCart(TEST_DATA.products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);

    // 2. Acessar carrinho e validar item presente
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    const cartItems = await cartPage.getItemNames();
    expect(cartItems).toContain(TEST_DATA.products.backpack);

    // 3. Iniciar processo de checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // 4. Preencher informações de entrega
    await checkoutPage.fillInformation(
      TEST_DATA.checkoutInfo.firstName,
      TEST_DATA.checkoutInfo.lastName,
      TEST_DATA.checkoutInfo.postalCode
    );

    // 5. Conferir resumo financeiro e finalizar pedido
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(checkoutPage.subtotalLabel).toBeVisible();
    await checkoutPage.finishCheckout();

    // 6. Validar tela de confirmação e sucesso
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('Deve alertar erro ao tentar avançar no checkout sem preencher dados obrigatórios', async () => {
    await inventoryPage.addProductToCart(TEST_DATA.products.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Tentativa de continuar com campos em branco
    await checkoutPage.fillInformation('', '', '');
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(TEST_DATA.errorMessages.firstNameRequired);
  });
});
