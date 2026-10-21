import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { TEST_DATA } from '../src/data/testData';

test.describe('End-to-End Checkout Flow', () => {
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

  test('should complete end-to-end purchase successfully', async ({ page }) => {
    // 1. Add item to cart
    await inventoryPage.addProductToCart(TEST_DATA.products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);

    // 2. Open cart and verify item
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    const cartItems = await cartPage.getItemNames();
    expect(cartItems).toContain(TEST_DATA.products.backpack);

    // 3. Proceed to checkout step one
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // 4. Fill shipping information
    await checkoutPage.fillInformation(
      TEST_DATA.checkoutInfo.firstName,
      TEST_DATA.checkoutInfo.lastName,
      TEST_DATA.checkoutInfo.postalCode
    );

    // 5. Verify overview and finish
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(checkoutPage.subtotalLabel).toBeVisible();
    await checkoutPage.finishCheckout();

    // 6. Confirm successful completion
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('should validate required fields in checkout information', async () => {
    await inventoryPage.addProductToCart(TEST_DATA.products.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Attempt to continue without filling fields
    await checkoutPage.fillInformation('', '', '');
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(TEST_DATA.errorMessages.firstNameRequired);
  });
});
