import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageLayout from '@/shared/components/layout/PageLayout';
import { renderWithProviders } from '../../../../../../tests/setup/test-utils';

describe('PageLayout component', () => {
  it('renders children within main element alongside Navbar and Footer', () => {
    renderWithProviders(
      <PageLayout>
        <div data-testid="page-content">Page Body Content</div>
      </PageLayout>,
      { route: '/dashboard' }
    );

    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getAllByText('PitchMint')[0]).toBeInTheDocument(); // Navbar / Footer branding
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument(); // Footer copyright
  });
});
