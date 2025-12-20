# Natalie Bakery - Testing Strategy & Documentation

This document provides a comprehensive guide on how to run, understand, and maintain the test suite for the Natalie Bakery project. The suite is divided into three layers: Backend Logic, Frontend Store/UI, and End-to-End User Journeys.

---

## 1. Backend Logic & API Contract (Django)
These tests ensure that the data structure and business rules (like pricing and singletons) remain intact.

### How to Run:
1. Navigate to the `backend` folder.
2. Run the following command:
   ```powershell
   python manage.py test api.tests
   ```

### What is tested:
*   **Model Logic (`test_models.py`)**: 
    *   **Slug Autogen**: Checks if slugs (e.g., `saffron-cake`) are created automatically when you save a product.
    *   **Singleton Pattern**: Confirms that there is only ever **one** global site configuration (Header/Footer info).
    *   **Customization Links**: Verifies that products can be correctly linked to customization options (flavors/sizes).
*   **API Contract (`test_api.py`)**: 
    *   Ensures the API returns exactly the fields the frontend expects (like `unit`, `is_custom_cake`, etc.). If a field is renamed in the backend, this test will fail to prevent breaking the website.

---

## 2. Frontend State & UI (Vitest)
These tests run in a simulated browser environment (JSDOM) and are extremely fast. They verify the cart's "brain" and individual UI pieces.

### How to Run:
1. Navigate to the `frontend` folder.
2. Run the following command:
   ```powershell
   npm test
   ```

### What is tested:
*   **Cart Logic (`cartStore.test.ts`)**: 
    *   **Identity**: Ensures a "Vanilla" cake and "Chocolate" cake are treated as separate items, even if they are the same base product.
    *   **Math**: Validates that quantities and total prices are calculated instantly as the user adds/removes items.
*   **Components (`ProductCard.test.tsx` & `FeaturedCarousel.test.tsx`)**:
    *   **Badges**: Confirms "New" and "Custom" badges appear only when they should.
    *   **Visual Scope**: Verifies that hover effects are isolated to a single card (named grouping logic).
    *   **Responsive Layout**: Checks if the carousel correctly hides navigation dots when there are too few products.

---

## 3. End-to-End User Journey (Playwright)
This is the "final exam." It opens a real browser and moves the mouse/clicks buttons exactly like a customer would.

### How to Run:
1. Navigate to the `frontend` folder.
2. Run the following command:
   ```powershell
   npm run test:e2e
   ```
   *(Optional: Add `-- --headed` if you want to see the browser window actually open and watch the test run.)*

### What is tested:
*   **Complete Flow**: The test starts on the Home page, navigates to a Product page, increases quantity, adds to bag, and then clicks the "Already in Bag" link to verify they successfully reached the Cart page.
*   **Success Indicators**: It waits for visual feedback (like the "Added to Bag" animation) to ensure the UI is responsive to user input.

---

## Summary of Logic & Reasoning

### Why use different folders?
Tests are placed near the code they verify. 
*   **Backend tests** need access to the database and Python environment.
*   **Frontend tests** need access to React and Node.js.
*   **E2E tests** sit in their own folder because they don't care about the code implementation; they only care about the final URL and what the user sees on screen.

### The "Failing Fast" Principle
By running `npm test` or `python manage.py test` during development, we catch bugs in seconds. The **API Contract** tests are especially important because they serve as a bridge, ensuring the Backend doesn't accidentally change something that causes a "white screen of death" on the Frontend.
