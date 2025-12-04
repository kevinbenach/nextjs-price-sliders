import { test, expect } from '@playwright/test';

/**
 * E2E Test: Exercise 1 - Normal Range
 * Tests drag interaction and label editing functionality
 */

test.describe('Exercise 1: Normal Range', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercise1');
    // Wait for range component to load (skeleton disappears)
    await expect(page.getByText('Exercise 1: Normal Range')).toBeVisible();
  });

  test('should load with initial min and max values', async ({ page }) => {
    // Wait for component to load (data fetched)
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    // Verify labels are visible
    const minLabel = page.locator('text=/1\\.00€/').first();
    const maxLabel = page.locator('text=/100\\.00€/').first();

    await expect(minLabel).toBeVisible();
    await expect(maxLabel).toBeVisible();
  });

  test('should drag minimum handle to update value', async ({ page }) => {
    // Wait for slider to be ready
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    const minHandle = page.locator('[aria-label*="Minimum"]').first();
    await expect(minHandle).toBeVisible();

    // Get initial position
    const initialBox = await minHandle.boundingBox();
    expect(initialBox).not.toBeNull();

    // Drag handle to the right (increase minimum value)
    await minHandle.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox!.x + 50, initialBox!.y);
    await page.mouse.up();

    // Value should have increased from initial 1.00€
    // We check that the min label no longer shows exactly 1.00€
    const minLabels = page.locator('text=/€/').filter({ hasText: /\d+\./ });
    const firstLabel = minLabels.first();
    const text = await firstLabel.textContent();

    // Should not be 1.00€ anymore (dragged right increases value)
    expect(text).not.toBe('1.00€');
  });

  test('should allow clicking label to edit value', async ({ page }) => {
    // Wait for component
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    // Find and click the minimum value label (the editable one)
    const minLabel = page.locator('[aria-label*="Minimum value:"]').first();
    await expect(minLabel).toBeVisible();
    await minLabel.click();

    // Input should appear
    const input = page.locator('[aria-label="Minimum value input"]');
    await expect(input).toBeVisible();

    // Type new value
    await input.fill('25');
    await input.press('Enter');

    // Wait a moment for state update
    await page.waitForTimeout(100);

    // Verify new value appears (might be in different format)
    await expect(page.locator('text=/25\\.00€/').first()).toBeVisible();
  });

  test('should not allow handles to cross', async ({ page }) => {
    await page.waitForSelector('[role="slider"]', { timeout: 5000 });

    // Get max handle
    const maxHandle = page.locator('[aria-label*="Maximum"]').first();
    const box = await maxHandle.boundingBox();
    expect(box).not.toBeNull();

    // Try to drag max handle all the way to the left
    await maxHandle.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x - 200, box!.y); // Drag far left
    await page.mouse.up();

    // Maximum value should still be greater than minimum
    // We verify by checking that both labels exist and max > min
    const labels = await page.locator('text=/\\d+\\.\\d+€/').allTextContents();
    expect(labels.length).toBeGreaterThanOrEqual(2);

    // Extract numbers and verify max > min
    const values = labels.map(l => parseFloat(l.replace('€', '')));
    expect(values[1]).toBeGreaterThan(values[0]);
  });
});
