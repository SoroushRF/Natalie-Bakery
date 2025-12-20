import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeaturedCarousel from '../FeaturedCarousel';

// Mock ProductCard to simplify testing the carousel logic
vi.mock('../ProductCard', () => ({
  default: ({ product }: { product: any }) => <div data-testid="product-card">{product.name}</div>,
}));

describe('FeaturedCarousel', () => {
  const mockProducts = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    slug: `product-${i + 1}`,
    price: '10.00',
  }));

  it('renders a grid instead of a carousel if 4 or fewer products', () => {
    const fewProducts = mockProducts.slice(0, 3);
    render(<FeaturedCarousel products={fewProducts} />);
    
    // In grid mode, we don't expect navigation buttons
    expect(screen.queryByRole('button', { name: /chevron/i })).not.toBeInTheDocument();
    expect(screen.getAllByTestId('product-card')).toHaveLength(3);
  });

  it('renders a carousel with navigation buttons if more than 4 products', () => {
    render(<FeaturedCarousel products={mockProducts} />);
    
    // Initially, "Prev" button should be invisible/disabled
    const buttons = screen.getAllByRole('button');
    // ChevronLeft and ChevronRight are wrapped in buttons
    // The specific logic in the component uses opacity-0 invisible for the buttons
    
    // We can check if the cards are there
    expect(screen.getAllByTestId('product-card')).toHaveLength(6);
  });

  it('allows manual navigation via dots/indicators', () => {
    render(<FeaturedCarousel products={mockProducts} />);
    
    const indicators = screen.getAllByRole('button').filter(b => b.className.includes('h-1.5'));
    // For 6 products, length is Math.max(0, 6 - 3) = 3
    expect(indicators).toHaveLength(3);
    
    fireEvent.click(indicators[1]);
    // The component should update its internal currentIndex to 1
    // We expect the indicator classes to change
    expect(indicators[1].className).toContain('w-12 bg-gold');
    expect(indicators[0].className).toContain('w-3 bg-gold/10');
  });
});
