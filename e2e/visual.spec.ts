import { test, expect, Page } from '@playwright/test';

async function login(page: Page) {
  const pwd = process.env.SITE_PASSWORD;
  if (!pwd) return;
  const inp = page.locator('input[type="password"]').first();
  if (await inp.isVisible({ timeout: 3000 }).catch(() => false)) {
    await inp.fill(pwd);
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');
  }
}

test.describe('Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await login(page);
    await page.waitForLoadState('networkidle');
  });

  test('메인 페이지 전체 레이아웃', async ({ page }) => {
    await expect(page).toHaveScreenshot('main-full.png', { fullPage: true });
  });

  test('z-index: 제목/콘텐츠 표시 확인', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });
});
