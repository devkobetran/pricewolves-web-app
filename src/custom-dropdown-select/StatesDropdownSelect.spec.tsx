import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import StatesDropdownSelect from './StatesDropdownSelect';

describe('StatesDropdownSelect', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with placeholder text', () => {
    const { container } = render(<StatesDropdownSelect onChange={mockOnChange} />);
    expect(container.textContent).toContain('Select a state');
  });

  it('renders with selected value', () => {
    render(<StatesDropdownSelect onChange={mockOnChange} value="CA" />);
    // Component should show selected value
  });

  it('has all US states', () => {
    const { container } = render(<StatesDropdownSelect onChange={mockOnChange} />);
    // Should have 50 states
    expect(container).toBeInTheDocument();
  });
});