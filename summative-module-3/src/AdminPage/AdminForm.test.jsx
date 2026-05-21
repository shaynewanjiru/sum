import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminForm from '../AdminPage/AdminForm';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('AdminForm Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockAlert.mockClear();
  });

  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <AdminForm />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Admin Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Administrator Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Administrator Password')).toBeInTheDocument();
  });

  it('navigates on successful login', async () => {
    render(
      <MemoryRouter>
        <AdminForm />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByPlaceholderText('Administrator Name'), {
      target: { value: 'admin' }
    });
    fireEvent.change(screen.getByPlaceholderText('Administrator Password'), {
      target: { value: 'password' }
    });
    
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/edit', { replace: true });
    });
  });

  it('shows alert on bad credentials', () => {
    render(
      <MemoryRouter>
        <AdminForm />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByPlaceholderText('Administrator Name'), {
      target: { value: 'hacker' }
    });
    fireEvent.change(screen.getByPlaceholderText('Administrator Password'), {
      target: { value: '1234' }
    });
    
    fireEvent.click(screen.getByText('Submit'));
    
    expect(mockAlert).toHaveBeenCalledWith('Invalid credentials. Please try again.');
  });
  
  it('has a submit button', () => {
    render(<MemoryRouter><AdminForm /></MemoryRouter>);
    const btn = screen.getByRole('button');
    expect(btn).toBeTruthy();
  });
});