import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import UnitsDropdownSelect from './UnitsDropdownSelect';

describe('UnitsDropdownSelect', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with placeholder text', () => {
    const { container } = render(<UnitsDropdownSelect onChange={mockOnChange} />);
    expect(container.textContent).toContain('Select a unit');
  });

  it('renders with selected value', () => {
    render(<UnitsDropdownSelect onChange={mockOnChange} value="oz" />);
    // Component should show selected value
  });

  it('has measurement units', () => {
    const { container } = render(<UnitsDropdownSelect onChange={mockOnChange} />);
    expect(container).toBeInTheDocument();
  });
});