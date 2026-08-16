import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../store';

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  const mockItem = {
    productId: 'prod-1',
    slug: 'test-product',
    name: 'Test Product',
    price: 100,
    image: '/test.jpg',
    size: 'M',
    color: 'Red',
    maxQuantity: 5,
  };

  it('should add an item to the cart', () => {
    useCartStore.getState().addItem(mockItem);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it('should increment quantity when adding the same item', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem(mockItem);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('should respect maxQuantity when adding items', () => {
    for (let i = 0; i < 6; i++) {
      useCartStore.getState().addItem(mockItem);
    }
    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(5); // clamped to maxQuantity
  });

  it('should update quantity manually', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().updateQuantity(mockItem.productId, mockItem.size, 4, mockItem.color);
    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(4);
  });

  it('should remove item when quantity is updated to 0', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().updateQuantity(mockItem.productId, mockItem.size, 0, mockItem.color);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('should remove item', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().removeItem(mockItem.productId, mockItem.size, mockItem.color);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });
});
