import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from '@/shared/components/layout/Navbar';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';

describe('Navbar', () => {
  it('renders navbar with user information when authenticated on dashboard', () => {
    renderWithProviders(<Navbar />, {
      route: '/dashboard',
      preloadedState: {
        auth: {
          user: {
            _id: '1',
            name: 'Test User',
            email: 'test@example.com',
            isPremium: false,
            credits: 5,
          },
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('PitchMint')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Credits badge
  });

  it('shows tools dropdown when hovered', () => {
    renderWithProviders(<Navbar />, {
      route: '/dashboard',
      preloadedState: {
        auth: {
          user: {
            _id: '1',
            name: 'Test User',
            email: 'test@example.com',
            isPremium: false,
            credits: 5,
          },
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    const toolsButton = screen.getByText('Tools');
    fireEvent.mouseEnter(toolsButton);
    expect(screen.getByText('Submit Idea')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('renders unauthenticated state with signin and get started buttons on non-landing route', () => {
    renderWithProviders(<Navbar />, {
      route: '/about',
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('Tools')).not.toBeInTheDocument();
  });

  it('handles user menu and logout action', () => {
    const { store } = renderWithProviders(<Navbar />, {
      route: '/dashboard',
      preloadedState: {
        auth: {
          user: {
            _id: '1',
            name: 'Test User',
            email: 'test@example.com',
            isPremium: false,
            credits: 5,
          },
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.token).toBeNull();
  });

  it('toggles mobile menu on button click', () => {
    renderWithProviders(<Navbar />, {
      route: '/dashboard',
      preloadedState: {
        auth: {
          user: {
            _id: '1',
            name: 'Test User',
            email: 'test@example.com',
            isPremium: false,
            credits: 5,
          },
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
    fireEvent.click(mobileMenuButton);
    expect(screen.getByRole('button', { name: /close main menu/i })).toBeInTheDocument();
  });
});