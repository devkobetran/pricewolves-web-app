import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound', () => {
  it('renders 404 error message', () => {
    render(<NotFound />);
    expect(screen.getByText('Page Not Found | 404')).toBeInTheDocument();
  });

  it('renders not found text', () => {
    render(<NotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});