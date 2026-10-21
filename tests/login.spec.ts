import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { TEST_DATA } from '../src/data/testData';

test.describe('Authentication & Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with standard user', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(
      TEST_DATA.users.standard.username,
      TEST_DATA.users.standard.password
    );

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('should show error message for locked out user', async () => {
    await loginPage.login(
      TEST_DATA.users.lockedOut.username,
      TEST_DATA.users.lockedOut.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(TEST_DATA.errorMessages.lockedOut);
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login(
      TEST_DATA.users.invalid.username,
      TEST_DATA.users.invalid.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(TEST_DATA.errorMessages.invalidCredentials);
  });

  test('should validate username is required', async () => {
    await loginPage.login('', 'some_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(TEST_DATA.errorMessages.usernameRequired);
  });

  test('should validate password is required', async () => {
    await loginPage.login('standard_user', '');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(TEST_DATA.errorMessages.passwordRequired);
  });
});
