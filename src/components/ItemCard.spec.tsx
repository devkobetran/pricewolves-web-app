import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemCard from './ItemCard';
import type { ItemCardProps } from './ItemCard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const ItemCardWithRouter = (props: ItemCardProps) => (
  <BrowserRouter>
    <ItemCard {...props} />
  </BrowserRouter>
);

const mockProps: ItemCardProps = {
  id: '1',
  itemImageUrl: 'https://example.com/image.jpg',
  itemName: 'Test Item',
  barcode: '123456789',
  description: 'Test description',
  category: 'Test Category',
  storeName: 'Test Store',
  isDiscount: false,
  itemPrice: 10.99,
};

describe('ItemCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders item information', () => {
    render(<ItemCardWithRouter {...mockProps} />);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('Test Store')).toBeInTheDocument();
  });

  it('displays regular price when not discounted', () => {
    render(<ItemCardWithRouter {...mockProps} />);
    expect(screen.getByText('$10.99')).toBeInTheDocument();
  });

  it('displays discounted price when item is on discount', () => {
    const discountedProps = {
      ...mockProps,
      isDiscount: true,
      discountedPrice: 8.99,
    };
    render(<ItemCardWithRouter {...discountedProps} />);
    
    expect(screen.getByText('$8.99')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument(); // Original price struck through
  });

  it('renders edit button', () => {
    render(<ItemCardWithRouter {...mockProps} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('formats whole numbers without decimals', () => {
    const wholeNumberProps = { ...mockProps, itemPrice: 10 };
    render(<ItemCardWithRouter {...wholeNumberProps} />);
    expect(screen.getByText('$10')).toBeInTheDocument();
  });
});