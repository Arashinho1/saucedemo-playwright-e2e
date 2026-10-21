import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortSelect: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  async isLoaded(): Promise<boolean> {
    return await this.title.isVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    const item = this.page.locator('[data-test="inventory-item"]', {
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
    await item.locator('button[data-test^="add-to-cart"]').click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const item = this.page.locator('[data-test="inventory-item"]', {
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
    await item.locator('button[data-test^="remove"]').click();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.textContent();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortSelect.selectOption(optionValue);
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const pricesText = await this.itemPrices.allTextContents();
    return pricesText.map((p) => parseFloat(p.replace('$', '')));
  }
}
