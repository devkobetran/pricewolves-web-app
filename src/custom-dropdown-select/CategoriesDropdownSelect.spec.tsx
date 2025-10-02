import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import CategoriesDropdownSelect, { categoryOptions } from './CategoriesDropdownSelect';

describe('CategoriesDropdownSelect', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with placeholder text', () => {
    const { container } = render(<CategoriesDropdownSelect onChange={mockOnChange} />);
    expect(container.textContent).toContain('Select a category');
  });

  it('has correct category options', () => {
    expect(categoryOptions).toContainEqual({ label: "Meat", value: "Meat" });
    expect(categoryOptions).toContainEqual({ label: "Electronics & Computers", value: "Electronics & Computers" });
    expect(categoryOptions).toContainEqual({ label: "Other", value: "Other" });
  });

  it('renders with selected value', () => {
    render(<CategoriesDropdownSelect onChange={mockOnChange} value="Meat" />);
    // Component should show selected value
  });

  it('exports categoryOptions for external use', () => {
    expect(categoryOptions).toBeDefined();
    expect(Array.isArray(categoryOptions)).toBe(true);
    expect(categoryOptions.length).toBeGreaterThan(0);
  });
});