import { test, expect } from '@playwright/test';

/**
 * E2E Test: Exercise 1 - Normal Range
 * Tests drag interaction and label editing functionality
 */

test.describe('Exercise 1: Normal Range', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercise1');
    await expect(page.getByText('Exercise 1: Normal Range')).toBeVisible();
  });

  test('should load with initial min and max values', async ({ page }) => {
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    const minLabel = page.locator('text=/1\\.00€/').first();
    const maxLabel = page.locator('text=/100\\.00€/').first();

    await expect(minLabel).toBeVisible();
    await expect(maxLabel).toBeVisible();
  });

  test('should drag minimum handle to update value', async ({ page }) => {
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    const minHandle = page.locator('[aria-label*="Minimum"]').first();
    await expect(minHandle).toBeVisible();

    const initialBox = await minHandle.boundingBox();
    expect(initialBox).not.toBeNull();

    await minHandle.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox!.x + 50, initialBox!.y);
    await page.mouse.up();

    const minLabels = page.locator('text=/€/').filter({ hasText: /\d+\./ });
    const firstLabel = minLabels.first();
    const text = await firstLabel.textContent();

    expect(text).not.toBe('1.00€');
  });

  test('should allow clicking label to edit value', async ({ page }) => {
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    const minLabel = page.locator('[aria-label*="Minimum value:"]').first();
    await expect(minLabel).toBeVisible();
    await minLabel.click();

    const input = page.locator('[aria-label="Minimum value input"]');
    await expect(input).toBeVisible();

    await input.fill('25');
    await input.press('Enter');

    await page.waitForTimeout(100);

    await expect(page.locator('text=/25\\.00€/').first()).toBeVisible();
  });

  test('should not allow handles to cross', async ({ page }) => {
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    const maxHandle = page.locator('[aria-label*="Maximum"]').first();
    const box = await maxHandle.boundingBox();
    expect(box).not.toBeNull();

    await maxHandle.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x - 200, box!.y);
    await page.mouse.up();

    const labels = await page.locator('text=/\\d+\\.\\d+€/').allTextContents();
    expect(labels.length).toBeGreaterThanOrEqual(2);

    const values = labels.map(l => parseFloat(l.replace('€', '')));
    expect(values[1]).toBeGreaterThan(values[0]);
  });
});
