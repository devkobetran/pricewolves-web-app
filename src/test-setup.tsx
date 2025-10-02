import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock AWS Amplify
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {
      Store: {
        list: vi.fn(() => Promise.resolve({ data: [] }))
      },
      Item: {
        list: vi.fn(() => Promise.resolve({ data: [] }))
      },
      PriceHistory: {
        list: vi.fn(() => Promise.resolve({ data: [] }))
      }
    }
  }))
}));

// Mock react-qr-barcode-scanner
vi.mock('react-qr-barcode-scanner', () => ({
  default: vi.fn(() => null),
  BarcodeStringFormat: {
    UPC_A: 'UPC_A',
    UPC_E: 'UPC_E',
    EAN_8: 'EAN_8',
    EAN_13: 'EAN_13'
  }
}));

// Mock react-dropdown-select
vi.mock('react-dropdown-select', () => ({
  default: vi.fn(({ placeholder }) => <div>{placeholder}</div>)
}));

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  LineElement: vi.fn(),
  PointElement: vi.fn(),
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  TimeScale: vi.fn()
}));

vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(() => null)
}));