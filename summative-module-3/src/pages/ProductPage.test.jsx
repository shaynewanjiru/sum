import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductPage from '../pages/ProductPage';

global.fetch = vi.fn();

describe('ProductPage tests', () => {
  const products = [
    { id: 1, name: 'Cool Gadget', price: 99, description: 'very cool', image: '' },
    { id: 2, name: 'Old Thing', price: 10, description: 'not cool', image: '' }
  ];

  beforeEach(() => {
    fetch.mockReset();
  });

  it('shows loading text', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    render(<ProductPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays fetched products', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => products
    });
    
    render(<ProductPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cool Gadget')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Old Thing')).toBeInTheDocument();
    expect(screen.getByText('Price: $99')).toBeInTheDocument();
  });

  it('filters by search term', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => products
    });
    
    render(<ProductPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cool Gadget')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search products by name...');
    fireEvent.change(searchInput, { target: { value: 'old' } });
    
    expect(screen.queryByText('Cool Gadget')).not.toBeInTheDocument();
    expect(screen.getByText('Old Thing')).toBeInTheDocument();
  });
  
  it('uses localhost api', () => {
    fetch.mockResolvedValueOnce({ json: async () => [] });
    render(<ProductPage />);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products');
  });
});