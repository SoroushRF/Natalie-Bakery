import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore, generateCartId } from '../useCartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  const mockProduct = {
    id: 1,
    slug: 'saffron-cake',
    name: 'Saffron Cake',
    price: '45.00',
    image: null,
    is_custom_cake: false,
  };

  it('generates a simple cart ID for products without options', () => {
    const id = generateCartId(1);
    expect(id).toBe('1');
  });

  it('generates a complex cart ID for products with options', () => {
    const options = { flavor: 'Vanilla', size: 'Large' };
    const id = generateCartId(1, options);
    expect(id).toBe('1-{"flavor":"Vanilla","size":"Large"}');
  });

  it('adds an item to the cart', () => {
    useCartStore.getState().addItem(mockProduct, 1);
    const items = useCartStore.getState().items;
    
    expect(items.length).toBe(1);
    expect(items[0].name).toBe('Saffron Cake');
    expect(items[0].quantity).toBe(1);
    expect(items[0].price).toBe(45);
  });

  it('increments quantity when adding the same item multiple times', () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().addItem(mockProduct, 2);
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(3);
  });

  it('treats items with different options as separate cart items', () => {
    const opt1 = { flavor: 'Vanilla' };
    const opt2 = { flavor: 'Chocolate' };
    
    useCartStore.getState().addItem(mockProduct, 1, opt1);
    useCartStore.getState().addItem(mockProduct, 1, opt2);
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(2);
    expect(items[0].flavor).toBe('Vanilla');
    expect(items[1].flavor).toBe('Chocolate');
  });

  it('removes an item from the cart', () => {
    const cartId = generateCartId(mockProduct.id);
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().removeItem(cartId);
    
    expect(useCartStore.getState().items.length).toBe(0);
  });

  it('updates the quantity of an item', () => {
    const cartId = generateCartId(mockProduct.id);
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().updateQuantity(cartId, 5);
    
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('calculates the total price correctly', () => {
    const p1 = { ...mockProduct, id: 1, price: '10' };
    const p2 = { ...mockProduct, id: 2, price: '20' };
    
    useCartStore.getState().addItem(p1, 2); // 20
    useCartStore.getState().addItem(p2, 1); // 20
    
    expect(useCartStore.getState().getTotalPrice()).toBe(40);
  });
  
  it('enforces a maximum quantity of 10 items', () => {
    useCartStore.getState().addItem(mockProduct, 15);
    expect(useCartStore.getState().items[0].quantity).toBe(10);
    
    useCartStore.getState().addItem(mockProduct, 5); 
    expect(useCartStore.getState().items[0].quantity).toBe(10); // Still 10
  });

  it('enforces a maximum quantity when updating', () => {
    const cartId = generateCartId(mockProduct.id);
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().updateQuantity(cartId, 20);
    expect(useCartStore.getState().items[0].quantity).toBe(10);
    
    useCartStore.getState().updateQuantity(cartId, -5);
    expect(useCartStore.getState().items[0].quantity).toBe(1); // Floor is 1
  });
});
