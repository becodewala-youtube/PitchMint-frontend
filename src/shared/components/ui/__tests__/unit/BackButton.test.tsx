import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BackButton from '@/shared/components/ui/BackButton';
import { renderWithProviders } from '../../../../../../tests/setup/test-utils';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('BackButton component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default label "Back"', () => {
    renderWithProviders(<BackButton />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('renders with custom label and applies custom className', () => {
    renderWithProviders(<BackButton label="Return to List" className="extra-class" />);
    const btn = screen.getByRole('button', { name: 'Return to List' });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('extra-class');
  });

  it('navigates back (-1) if browser history idx > 0', () => {
    Object.defineProperty(window, 'history', {
      value: {
        state: { idx: 2 },
      },
      writable: true,
    });

    renderWithProviders(<BackButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('navigates to fallbackUrl if browser history idx <= 0 or missing', () => {
    Object.defineProperty(window, 'history', {
      value: {
        state: { idx: 0 },
      },
      writable: true,
    });

    renderWithProviders(<BackButton fallbackUrl="/custom-fallback" />);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockNavigate).toHaveBeenCalledWith('/custom-fallback');
  });
});
