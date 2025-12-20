---
description: Design and Responsive Guidelines for Natalie Bakery
---

# Design & Responsive Principles

This document serves as the source of truth for the Natalie Bakery design system and responsive layout. **ALL** future edits must strictly adhere to these rules to maintain the premium boutique aesthetic.

## 1. Grid and Alignment
- **Spaciousness**: Maintain a high-end, editorial feel with significant whitespace.
- **Consistency**: Never break the existing grid systems on Home, Shop, or Detail pages.

## 2. Mobile Responsive Rules (Small Screens)
- **Horizontal Page Margins**: 
    - Use `px-10` for main `max-w-7xl` containers on mobile viewports.
    - Example: `<div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-8">`
- **Product Cards (Shop/Home)**:
    - Maintain the 2-column grid on mobile that naturally scales cards.
- **Cart Page Cards**:
    - Product cards (the white containers) must be constrained to `max-w-[85%] mx-auto` on mobile.
    - Product images within those cards must be scaled (e.g., `w-[60%]`).
- **Product Detail Page**:
    - The main product image container must be constrained to `max-w-[85%] mx-auto` on mobile.

## 3. Communication & Quality Control
- **No Placeholders**: Always use `generate_image` or actual project assets.
- **Verification**: After ANY change to layout or features, use a browser subagent to:
    1. Resize to `375x812`.
    2. Verify `px-10` margins are intact.
    3. Verify mobile card scaling (`max-w-[85%]`) is maintained.
    4. Capture screenshots to prove consistency.

**CRITICAL: Never lose or overwrite these responsive settings when adding new features.**
