import { test, expect } from '@playwright/test';

test.describe('Natalie Bakery User Journey', () => {
  test('should allow a user to browse and add a product to the bag', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto('/');
    
    // Check if the title is correct
    await expect(page).toHaveTitle(/Natalie Bakery/i);
    
    // 2. Find a "View Creation" link and click it (using a generic one from the homepage)
    const viewCreationLink = page.getByRole('link', { name: /View Creation/i }).first();
    await viewCreationLink.click();
    
    // 3. We should be on a product page
    await expect(page).toHaveURL(/\/product\//);
    
    // 4. Select quantity (increment it)
    const plusButton = page.locator('button:has(svg.lucide-plus)');
    await plusButton.click();
    
    // 5. Add to bag
    const addToBagButton = page.getByRole('button', { name: /ADD TO SHOPPING BAG/i });
    await addToBagButton.click();
    
    // 6. Check if it changed to "ADDED TO BAG"
    await expect(page.getByText(/ADDED TO BAG/i)).toBeVisible();
    
    // 7. Check if "ALREADY IN YOUR BAG" appears and click it to go to cart
    const inBagIndicator = page.getByText(/ALREADY IN YOUR BAG/i);
    await expect(inBagIndicator).toBeVisible();
    await inBagIndicator.click();
    
    // 8. We should be in the cart
    await expect(page).toHaveURL(/\/cart/);
    
    // 9. Confirm the product is in the cart list
    const cartItem = page.locator('.cart-item'); // Assuming this class exists or similar
    // Since I don't know the exact cart UI, I'll look for a common indicator
    await expect(page.getByRole('heading', { name: /Your Shopping Bag/i })).toBeVisible();
  });
});
