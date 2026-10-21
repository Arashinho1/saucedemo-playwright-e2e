import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { TEST_DATA } from '../src/data/testData';

test.describe('Inventory & Catalog Tests', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      TEST_DATA.users.standard.username,
      TEST_DATA.users.standard.password
    );

    inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.title).toBeVisible();
  });

  test('should sort products alphabetically Z to A', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('should sort products by price Low to High', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('should update cart badge when adding and removing an item', async () => {
    expect(await inventoryPage.getCartCount()).toBe(0);

    await inventoryPage.addProductToCart(TEST_DATA.products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeProductFromCart(TEST_DATA.products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(0);
  });
});
