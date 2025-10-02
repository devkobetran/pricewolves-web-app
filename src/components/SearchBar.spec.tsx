import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders search input with placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Find an item at a good price!')).toBeInTheDocument();
  });

  it('renders search icon', () => {
    render(<SearchBar />);
    const searchIcon = document.querySelector('[data-icon="magnifying-glass"]');
    expect(searchIcon).toBeInTheDocument();
  });
});