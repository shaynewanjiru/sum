import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductEditPage from '../AdminPage/ProductEditPage';

global.fetch = vi.fn();
const mockConfirm = vi.spyOn(window, 'confirm').mockImplementation(() => true);

describe('ProductEditPage', () => {
  const testProducts = [
    { id: '1', name: 'Widget', price: '25', description: 'A widget', image: '' },
    { id: '2', name: 'Gadget', price: '50', description: 'A gadget', image: '' }
  ];

  beforeEach(() => {
    fetch.mockReset();
    mockConfirm.mockClear();
  });

  it('renders heading', () => {
    fetch.mockResolvedValueOnce({ json: async () => [] });
    render(<ProductEditPage />);
    expect(screen.getByText('Manage Products')).toBeInTheDocument();
  });

  it('loads and shows products', async () => {
    fetch.mockResolvedValueOnce({ json: async () => testProducts });
    
    render(<ProductEditPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Widget')).toBeInTheDocument();
    });
    expect(screen.getByText('Gadget')).toBeInTheDocument();
  });

  it('can delete a product', async () => {
    fetch
      .mockResolvedValueOnce({ json: async () => testProducts })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ json: async () => [testProducts[1]] });
    
    render(<ProductEditPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Widget')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockConfirm).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products/1', {
      method: 'DELETE'
    });
  });

  it('shows add form when button clicked', async () => {
    fetch.mockResolvedValueOnce({ json: async () => testProducts });
    
    render(<ProductEditPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Widget')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('+ Add New Product'));
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
  });
  
  it('can fill out the form', async () => {
    fetch.mockResolvedValueOnce({ json: async () => [] });
    
    render(<ProductEditPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Manage Products')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('+ Add New Product'));
    
    fireEvent.change(screen.getByPlaceholderText('Product Name'), {
      target: { value: 'New Item' }
    });
    fireEvent.change(screen.getByPlaceholderText('Product Price'), {
      target: { value: '100' }
    });
    
    expect(screen.getByDisplayValue('New Item')).toBeInTheDocument();
  });
});