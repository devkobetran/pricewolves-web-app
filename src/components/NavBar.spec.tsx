import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar';

const NavBarWithRouter = () => (
  <BrowserRouter>
    <NavBar />
  </BrowserRouter>
);

describe('NavBar', () => {
  it('renders navigation links', () => {
    render(<NavBarWithRouter />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create New Item')).toBeInTheDocument();
    expect(screen.getByText('Create New Store')).toBeInTheDocument();
  });

  it('renders menu toggle button', () => {
    render(<NavBarWithRouter />);
    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<NavBarWithRouter />);
    const menuButton = screen.getByRole('button');
    
    // Menu should not be visible initially
    expect(document.querySelector('.popup-menu')).not.toBeInTheDocument();
    
    // Click to open menu
    fireEvent.click(menuButton);
    expect(document.querySelector('.popup-menu')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    render(<NavBarWithRouter />);
    expect(screen.getByPlaceholderText('Find an item at a good price!')).toBeInTheDocument();
  });
});