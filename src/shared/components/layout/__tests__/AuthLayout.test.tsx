import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AuthLayout from '@/shared/components/layout/AuthLayout';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';

describe('AuthLayout component', () => {
  it('renders children and default security trust badge', () => {
    renderWithProviders(
      <AuthLayout>
        <div data-testid="auth-child">Login Form Content</div>
      </AuthLayout>
    );

    expect(screen.getByTestId('auth-child')).toBeInTheDocument();
    expect(screen.getByText('Secure & encrypted connection')).toBeInTheDocument();
  });

  it('renders custom badge text if provided', () => {
    renderWithProviders(
      <AuthLayout badgeText="Verified by PitchMint">
        <div>Content</div>
      </AuthLayout>
    );

    expect(screen.getByText('Verified by PitchMint')).toBeInTheDocument();
  });
});
