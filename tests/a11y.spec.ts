import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    // Analyze the page for accessibility violations
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Verify there are no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
