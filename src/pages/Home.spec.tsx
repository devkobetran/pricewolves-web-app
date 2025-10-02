import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

const HomeWithRouter = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

describe('Home', () => {
  it('renders welcome title', () => {
    render(<HomeWithRouter />);
    expect(screen.getByText('Welcome to Price Wolves!')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<HomeWithRouter />);
    expect(screen.getByText('Price Wolves aim to hunt stores with the lowest prices.')).toBeInTheDocument();
  });

  it('renders dashboard link button', () => {
    render(<HomeWithRouter />);
    const dashboardLink = screen.getByText('Go to Dashboard');
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink.closest('a')).toHaveAttribute('href', '/dashboard');
  });
});