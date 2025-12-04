import { test, expect } from '@playwright/test';

/**
 * E2E Test: Navigation Flow
 * Verifies users can navigate between all pages
 */

test.describe('Navigation', () => {
  test('should navigate from home to exercises and back', async ({ page }) => {
    // Start at home page
    await page.goto('/');

    // Verify home page loaded
    await expect(page).toHaveTitle(/Range Component - MANGO Technical Test/i);
    await expect(page.getByText('MANGO Range Component')).toBeVisible();

    // Navigate to Exercise 1
    await page.getByRole('link', { name: /Exercise 1: Normal Range/i }).click();
    await expect(page).toHaveURL('/exercise1');
    await expect(page.getByText('Exercise 1: Normal Range')).toBeVisible();

    // Navigate to Exercise 2 from Exercise 1
    await page.getByRole('link', { name: /Exercise 2/i }).click();
    await expect(page).toHaveURL('/exercise2');
    await expect(page.getByText('Exercise 2: Fixed Values Range')).toBeVisible();

    // Navigate back to home
    await page.getByRole('link', { name: /Home/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('should show navigation links on exercise pages', async ({ page }) => {
    await page.goto('/exercise1');

    // Verify navigation links are present
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Exercise 2/i })).toBeVisible();
  });
});
