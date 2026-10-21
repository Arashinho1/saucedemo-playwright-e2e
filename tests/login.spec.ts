import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { TEST_DATA } from '../src/data/testData';

test.describe('Autenticação e Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Deve realizar login com sucesso usando credenciais válidas', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(
      TEST_DATA.users.standard.username,
      TEST_DATA.users.standard.password
    );

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('Deve exibir mensagem de bloqueio para usuário desativado', async () => {
    await loginPage.login(
      TEST_DATA.users.lockedOut.username,
      TEST_DATA.users.lockedOut.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(TEST_DATA.errorMessages.lockedOut);
  });

  test('Deve exibir mensagem de erro ao informar credenciais inválidas', async () => {
    await loginPage.login(
      TEST_DATA.users.invalid.username,
      TEST_DATA.users.invalid.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(TEST_DATA.errorMessages.invalidCredentials);
  });

  test('Deve alertar obrigatoriedade quando o usuário não for informado', async () => {
    await loginPage.login('', 'some_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(TEST_DATA.errorMessages.usernameRequired);
  });

  test('Deve alertar obrigatoriedade quando a senha não for informada', async () => {
    await loginPage.login('standard_user', '');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(TEST_DATA.errorMessages.passwordRequired);
  });
});
