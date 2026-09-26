import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '@/shared/components/layout/Footer';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';

describe('Footer component', () => {
  it('renders branding, links, and operational status', () => {
    renderWithProviders(<Footer />);

    expect(screen.getAllByText('PitchMint')[0]).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('All systems operational')).toBeInTheDocument();
  });
});
