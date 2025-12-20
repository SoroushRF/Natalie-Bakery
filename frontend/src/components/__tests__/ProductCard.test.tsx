import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../ProductCard';

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Saffron Rose Cake',
    slug: 'saffron-rose-cake',
    price: '45.00',
    unit: 'ea',
    category_name: 'Cakes',
    created_at: new Date().toISOString(),
    is_custom_cake: true,
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Saffron Rose Cake')).toBeInTheDocument();
    expect(screen.getByText('$45.00')).toBeInTheDocument();
    expect(screen.getByText('/ ea')).toBeInTheDocument();
  });

  it('shows "New Selection" badge for recent products', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('New Selection')).toBeInTheDocument();
  });

  it('shows "Custom Cake" badge for custom cakes', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Custom Cake')).toBeInTheDocument();
  });

  it('links to the correct product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link', { name: /View Creation/i });
    expect(link).toHaveAttribute('href', '/product/saffron-rose-cake');
  });

  it('uses the correct group grouping for isolated hover', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const mainDiv = container.firstChild as HTMLElement;
    
    // Check for the named group we added earlier
    expect(mainDiv.className).toContain('group/card');
  });
});
