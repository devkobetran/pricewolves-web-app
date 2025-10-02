import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

const FooterWithRouter = () => (
  <BrowserRouter>
    <Footer />
  </BrowserRouter>
);

describe('Footer', () => {
  it('renders business name link', () => {
    render(<FooterWithRouter />);
    expect(screen.getByText('Price Wolves')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<FooterWithRouter />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create New Item')).toBeInTheDocument();
    expect(screen.getByText('Create New Store')).toBeInTheDocument();
  });

  it('renders copyright notice with current year', () => {
    render(<FooterWithRouter />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Price Wolves. All rights reserved.`)).toBeInTheDocument();
  });

  it('renders contributor links', () => {
    render(<FooterWithRouter />);
    expect(screen.getByText('Kobe Tran')).toBeInTheDocument();
    expect(screen.getByText('Jeffrey Cheung')).toBeInTheDocument();
  });
});