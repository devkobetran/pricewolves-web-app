import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Scanner from './Scanner';

describe('Scanner', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders barcode input field', () => {
    render(<Scanner value="" onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('Barcode')).toBeInTheDocument();
  });

  it('renders scan button', () => {
    render(<Scanner value="" onChange={mockOnChange} />);
    expect(screen.getByText('Scan')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(<Scanner value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Barcode');
    fireEvent.change(input, { target: { value: '123456789' } });
    expect(mockOnChange).toHaveBeenCalledWith('123456789');
  });

  it('shows scanner overlay when scan button is clicked', () => {
    render(<Scanner value="" onChange={mockOnChange} />);
    const scanButton = screen.getByText('Scan');
    fireEvent.click(scanButton);
    expect(screen.getByText('Loading barcode scanner...')).toBeInTheDocument();
  });

  it('shows cancel button in scanner overlay', () => {
    render(<Scanner value="" onChange={mockOnChange} />);
    const scanButton = screen.getByText('Scan');
    fireEvent.click(scanButton);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});