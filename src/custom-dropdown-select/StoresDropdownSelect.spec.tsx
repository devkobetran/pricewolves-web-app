import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import StoresDropdownSelect from './StoresDropdownSelect';
import type { Store } from '../types';

const mockStore: Store = {
  id: '1',
  storeName: 'Test Store',
  storeLocations: [{
    streetName: '123 Test St',
    city: 'Test City',
    state: 'CA',
    zipCode: '12345'
  }],
  isBigChain: false,
  storeLogoUrl: 'https://example.com/logo.png',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

describe('StoresDropdownSelect', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with loading placeholder initially', () => {
    const { container } = render(<StoresDropdownSelect onChange={mockOnChange} />);
    expect(container.textContent).toContain('Loading stores...');
  });

  it('renders with select placeholder after loading', async () => {
    const { container } = render(<StoresDropdownSelect onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(container.textContent).toContain('Select a store');
    });
  });

  it('renders with selected value', () => {
    render(<StoresDropdownSelect onChange={mockOnChange} value={mockStore} />);
    // Component should show selected value
  });
});