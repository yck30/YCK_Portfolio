import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage and display key sections', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/CK - Portfolio/i);

    // Check Hero Section
    const hero = page.locator('section#studio, .intro');
    await expect(hero.first()).toBeVisible();

    // Check Journey Section
    const journey = page.locator('section#journey');
    await expect(journey).toBeVisible();

    // Check Projects Section
    const projects = page.locator('section#projects');
    await expect(projects).toBeVisible();

    // Check Contact Section
    const contact = page.locator('section#contact');
    await expect(contact).toBeVisible();
  });

  test('contact form should have required fields', async ({ page }) => {
    const contactForm = page.locator('form');
    await expect(contactForm).toBeVisible();
    
    // Verify inputs
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('required', '');

    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('required', '');

    const messageInput = page.locator('textarea[name="message"]');
    await expect(messageInput).toBeVisible();
    await expect(messageInput).toHaveAttribute('required', '');
  });
});
