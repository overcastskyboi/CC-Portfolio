import { test, expect } from '@playwright/test';

test('performance benchmark', async ({ page }) => {
  // Navigate to app
  const navigateStart = Date.now();
  await page.goto('/');
  const navigateEnd = Date.now();

  // Wait for Lock Screen (interaction ready)
  await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });
  
  const performanceTiming = await page.evaluate(() => JSON.stringify(window.performance.timing));
  const timing = JSON.parse(performanceTiming);
  
  const loadTime = timing.loadEventEnd - timing.navigationStart;
  const domContentLoad = timing.domContentLoadedEventEnd - timing.navigationStart;

  console.log('--- Performance Metrics ---');
  console.log(`Navigation to Render: ${navigateEnd - navigateStart}ms`);
  console.log(`DOM Content Loaded: ${domContentLoad}ms`);
  console.log(`Full Page Load: ${loadTime}ms`);

  // Basic thresholds
  expect(domContentLoad).toBeLessThan(2000); // 2s budget
  
  // Lighthouse-style check (simplified LCP proxy)
  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      // Fallback
      setTimeout(() => resolve(0), 3000);
    });
  });
  
  console.log(`LCP (Approx): ${lcp}ms`);
  
});
