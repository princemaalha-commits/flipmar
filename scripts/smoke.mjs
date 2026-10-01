import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { launchBrowser } from './browser.mjs';

const url = process.env.BASE_URL || 'http://127.0.0.1:5173';
await mkdir('test-results', { recursive: true });
const browser = await launchBrowser();
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const pageErrors = [];
const checks = [];
page.on('pageerror', (error) => pageErrors.push(error.message));
const pass = (name) => {
  checks.push(name);
  console.log(`✓ ${name}`);
};
const reset = async () => {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle' });
};
const audit = async (name) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  await writeFile(`test-results/axe-${name}.json`, JSON.stringify(results.violations, null, 2));
  assert.equal(
    results.violations.length,
    0,
    `${name}: ${results.violations.map((v) => `${v.id} (${v.nodes.length} nodes)`).join(', ')}`,
  );
  pass(`${name}: no WCAG A/AA axe violations`);
};

try {
  await reset();
  await expect(page.locator('h1')).toHaveText('Discover the world’stop designers.');
  await expect(page.locator('.shot-card')).toHaveCount(12);
  assert.equal(
    await page
      .locator('.shot-card img')
      .evaluateAll(
        (images) => images.filter((image) => image.complete && !image.naturalWidth).length,
      ),
    0,
  );
  pass('Homepage renders 12 locally served designs');
  await audit('homepage');

  let first = page.locator('.shot-card').first();
  await first.locator('.like-stat').click();
  await expect(first.locator('.like-stat')).toHaveAttribute('aria-pressed', 'true');
  await expect(first.locator('.like-stat span')).toHaveText('147');
  await first.hover();
  await first
    .getByRole('button', { name: 'Save Green Amigos — A growing identity', exact: true })
    .click();
  await expect(first.locator('.saved-marker')).toBeVisible();
  await page.reload({ waitUntil: 'networkidle' });
  first = page.locator('.shot-card').first();
  await expect(first.locator('.like-stat')).toHaveAttribute('aria-pressed', 'true');
  await expect(first.locator('.saved-marker')).toBeVisible();
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await page.getByRole('button', { name: /Saved inspiration/ }).click();
  await expect(page.locator('.shot-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Your saved inspiration' })).toBeVisible();
  pass('Likes, bookmarks, persistence, and the saved collection');
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();

  await page.getByRole('button', { name: 'Branding', exact: true }).first().click();
  await expect(page.locator('.shot-card')).toHaveCount(9);
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('button', { name: 'Filter by purple' }).click();
  await expect(page.locator('.shot-card')).toHaveCount(4);
  await expect(page.locator('.shot-card').first().locator('.shot-open')).toHaveAttribute(
    'aria-label',
    'View Vital — A brighter way to bank',
  );
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.locator('.sort-button').click();
  await page.getByRole('button', { name: 'Most liked', exact: true }).click();
  await expect(page.locator('.shot-card').first().locator('.shot-open')).toHaveAttribute(
    'aria-label',
    'View Vital — A brighter way to bank',
  );
  pass('Categories, color filters, reset, and sorting');

  await page.getByRole('searchbox', { name: 'Search shots' }).fill('mobile app');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('.shot-card')).toHaveCount(3);
  await page.getByRole('searchbox', { name: 'Search shots' }).fill('this-design-does-not-exist');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A little too specific?' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(page.locator('.shot-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'landing page', exact: true }).click();
  await expect(page.locator('.shot-card')).toHaveCount(5);
  pass('Text search, trending searches, and friendly empty states');

  await page.locator('.shot-open').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  assert.ok(new URL(page.url()).searchParams.get('shot'));
  await page.screenshot({ path: 'test-results/shot-detail.png' });
  await audit('shot-detail');
  for (let index = 0; index < 14; index++) {
    await page.keyboard.press('Tab');
    assert.equal(
      await page.evaluate(() =>
        document.querySelector('[role="dialog"]')?.contains(document.activeElement),
      ),
      true,
    );
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  assert.equal(new URL(page.url()).searchParams.has('shot'), false);
  await expect(page.locator('.shot-open').first()).toBeFocused();
  pass('Shot previews, shareable URLs, keyboard focus trapping, and Escape');

  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await page.locator('.search-mode-button').click();
  await page
    .locator('.search-mode-menu')
    .getByRole('button', { name: 'Designers', exact: true })
    .click();
  await expect(page.locator('.designer-card')).toHaveCount(12);
  await page.getByRole('searchbox', { name: 'Search designers' }).fill('alex');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('.designer-card')).toHaveCount(1);
  await page.getByRole('button', { name: "View Alex Morgan's work" }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Get in touch', exact: true }).click();
  await page.getByLabel('Your name', { exact: true }).fill('Demo Designer');
  await page.getByLabel('Email address', { exact: true }).fill('demo@example.com');
  await page
    .getByLabel('Your message')
    .fill('I would love to create an inspiring new portfolio website.');
  await audit('contact-form');
  await page.getByRole('button', { name: 'Preview your inquiry' }).click();
  await expect(
    page.getByRole('heading', { name: 'A great connection starts here.' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  pass('Designer search, profiles, and the transparent demo inquiry form');

  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await page.locator('.search-mode-button').click();
  await page
    .locator('.search-mode-menu')
    .getByRole('button', { name: 'Services', exact: true })
    .click();
  await expect(page.locator('.service-card')).toHaveCount(12);
  await page.locator('.service-cover').first().click();
  await expect(page.getByRole('heading', { name: 'Let’s make it happen.' })).toBeVisible();
  await page.keyboard.press('Escape');
  pass('Service browsing and service inquiries');

  await page.getByRole('button', { name: 'Hire talent', exact: true }).first().click();
  await page
    .getByLabel('What are you working on?')
    .fill('A beautiful identity for a neighborhood coffee shop');
  await page
    .getByLabel('A little more about your idea')
    .fill('We need a welcoming brand identity, packaging, and a small e-commerce website.');
  await page.getByRole('button', { name: 'Create your project brief' }).click();
  await expect(page.getByRole('heading', { name: 'Your project brief is ready.' })).toBeVisible();
  await page.getByRole('button', { name: 'Explore matching designers' }).click();
  await expect(page.locator('.designer-card')).toHaveCount(6);
  pass('Project briefs and matching creative partners');

  await page.getByRole('button', { name: 'For designers', exact: true }).first().click();
  await page.getByRole('button', { name: /Share your work/ }).click();
  await page
    .getByLabel('Upload design image')
    .setInputFiles(resolve('public/images/green-amigos.webp'));
  await expect(page.getByAltText('Your shot preview')).toBeVisible();
  await page.getByLabel('Give your shot a title').fill('A fresh community shot');
  await page.getByLabel('Category', { exact: true }).selectOption('Typography');
  await page.getByRole('button', { name: 'Publish your shot' }).click();
  await expect(page.locator('.shot-card').first().locator('.shot-open')).toHaveAttribute(
    'aria-label',
    'View A fresh community shot',
  );
  await expect(page.locator('.shot-card').first().locator('.designer-name')).toHaveText('You');
  pass('Image uploads, published session-only shots, and your local profile');

  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  await page.getByLabel('Your name', { exact: true }).fill('Demo Creative');
  await page.getByLabel('Email address', { exact: true }).fill('demo@example.com');
  await audit('account-form');
  await page.getByRole('button', { name: 'Create demo account' }).click();
  await page.getByRole('button', { name: 'Account menu' }).click();
  await expect(page.getByText('Hello, Demo')).toBeVisible();
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Log in', exact: true })).toBeVisible();
  pass('Demo account creation and logout without sending credentials');

  await reset();
  await page.getByRole('button', { name: 'Load more inspiration' }).click();
  await expect(page.locator('.shot-card')).toHaveCount(20);
  await page.getByRole('button', { name: 'Load more inspiration' }).click();
  await expect(page.locator('.shot-card')).toHaveCount(24);
  await expect(page.getByText('You’re all caught up. Great ideas never stop.')).toBeVisible();
  pass('Pagination loads all 24 unique designs');

  await page.evaluate(() => {
    localStorage.setItem('dribbble-demo-liked', '{broken json');
    localStorage.setItem('dribbble-demo-saved', '{"not":"an array"}');
    localStorage.setItem('dribbble-demo-user', '{"name":42}');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('.shot-card')).toHaveCount(12);
  await expect(page.getByRole('button', { name: 'Log in', exact: true })).toBeVisible();
  pass('Invalid stored preferences recover safely');

  for (const [name, width, height] of [
    ['desktop', 1440, 960],
    ['laptop', 1280, 900],
    ['tablet', 800, 1000],
    ['mobile', 390, 844],
    ['small-mobile', 320, 700],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
      brokenImages: [...document.images].filter((image) => image.complete && !image.naturalWidth)
        .length,
    }));
    assert.equal(layout.document, layout.viewport, `${name}: horizontal overflow`);
    assert.equal(layout.brokenImages, 0, `${name}: broken artwork`);
    await page.screenshot({ path: `test-results/${name}.png` });
    pass(`${name}: responsive layout, no overflow or broken images`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('button', { name: 'Explore', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await page.getByRole('button', { name: /New & noteworthy/ }).click();
  await expect(page.locator('.sort-button')).toHaveText('New & Noteworthy');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await audit('mobile');
  pass('Mobile navigation and category browsing');

  await page.goto(`${url}/?shot=green-amigos`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.shot-detail-header > h2')).toHaveText(
    'Green Amigos — A growing identity',
  );
  await page.keyboard.press('Escape');
  pass('Shared shot links open the correct design');
  assert.deepEqual(pageErrors, []);
  pass('No browser runtime errors throughout all flows');
  await writeFile(
    'test-results/ui-report.json',
    JSON.stringify({ passed: checks.length, checks, pageErrors }, null, 2),
  );
  console.log(`\n${checks.length} browser checks passed.`);
} catch (error) {
  await page.screenshot({ path: 'test-results/failure.png' }).catch(() => {});
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
