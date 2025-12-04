import { test, expect } from '@playwright/test';

/**
 * E2E Test: Exercise 2 - Fixed Values Range
 * Tests fixed value snapping and display
 */

test.describe('Exercise 2: Fixed Values Range', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercise2');
    await expect(page.getByText('Exercise 2: Fixed Values Range')).toBeVisible();
  });

  test('should display available fixed values', async ({ page }) => {
    // Wait for component to load
    await page.waitForSelector('text=/Available values:/i', { timeout: 5000 });

    // Verify the fixed values are displayed
    await expect(page.getByText(/Available values:/i)).toBeVisible();

    // Check that predefined values are shown
    const expectedValues = ['1.99', '5.99', '10.99', '30.99', '50.99', '70.99'];

    for (const value of expectedValues) {
      await expect(page.locator(`text=/${value}/`).first()).toBeVisible();
    }
  });

  test('should load with range component', async ({ page }) => {
    // Wait for range component
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    // Verify both handles are present
    const handles = page.locator('[role="slider"]');
    await expect(handles).toHaveCount(2);

    // Verify labels show values from the fixed set
    const minLabel = page.locator('text=/1\\.99€/').first();
    const maxLabel = page.locator('text=/70\\.99€/').first();

    await expect(minLabel).toBeVisible();
    await expect(maxLabel).toBeVisible();
  });

  test('should snap to fixed values when dragging', async ({ page }) => {
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    const minHandle = page.locator('[aria-label*="Minimum"]').first();
    await expect(minHandle).toBeVisible();

    // Drag the handle
    const box = await minHandle.boundingBox();
    expect(box).not.toBeNull();

    await minHandle.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + 30, box!.y);
    await page.mouse.up();

    // Wait for value update
    await page.waitForTimeout(200);

    // Verify the value is one of the fixed values (not arbitrary)
    // Get all price labels (both in the range handles)
    const labelElements = await page.locator('[role="slider"]').count();
    expect(labelElements).toBe(2); // Should have 2 handles

    // The values should be from the fixed set
    const minLabel = page.locator('text=/1\\.99€|5\\.99€|10\\.99€/').first();
    await expect(minLabel).toBeVisible();
  });

  test('should have non-editable labels', async ({ page }) => {
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    // Try to click a label (should not become editable)
    const label = page.locator('text=/1\\.99€/').first();
    await expect(label).toBeVisible();
    await label.click();

    // No input should appear (labels are read-only in fixed mode)
    const input = page.locator('input[type="text"]');
    await expect(input).not.toBeVisible();
  });

  test('should not allow handles to cross', async ({ page }) => {
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    // Get min handle and drag it far right
    const minHandle = page.locator('[aria-label*="Minimum"]').first();
    const box = await minHandle.boundingBox();
    expect(box).not.toBeNull();

    await minHandle.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + 300, box!.y);
    await page.mouse.up();

    await page.waitForTimeout(200);

    // Get both values
    const labels = await page.locator('text=/\\d+\\.99€/').allTextContents();
    expect(labels.length).toBeGreaterThanOrEqual(2);

    // Parse values
    const values = labels.map(l => parseFloat(l.replace('€', '')));

    // Min should still be less than max
    expect(values[0]).toBeLessThan(values[1]);
  });
});
