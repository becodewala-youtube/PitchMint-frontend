import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InsufficientCreditsModal from '@/features/credits/components/InsufficientCreditsModal';
import { renderWithProviders } from '../../../../tests/setup/test-utils';

describe('InsufficientCreditsModal component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = renderWithProviders(
      <InsufficientCreditsModal
        isOpen={false}
        onClose={vi.fn()}
        creditsRequired={2}
        creditsAvailable={0}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders credit requirements and balance when isOpen is true', () => {
    renderWithProviders(
      <InsufficientCreditsModal
        isOpen={true}
        onClose={vi.fn()}
        creditsRequired={3}
        creditsAvailable={1}
      />
    );

    expect(screen.getByText('Insufficient Credits')).toBeInTheDocument();
    expect(
      screen.getByText(/You need 3 credits to use this feature, but you only have 1 credit available./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buy More Credits/i })).toBeInTheDocument();
  });

  it('triggers onClose when close button or cancel is clicked', () => {
    const onClose = vi.fn();
    renderWithProviders(
      <InsufficientCreditsModal
        isOpen={true}
        onClose={onClose}
        creditsRequired={1}
        creditsAvailable={0}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('navigates to /credits and closes on Buy More Credits click', () => {
    const onClose = vi.fn();
    renderWithProviders(
      <InsufficientCreditsModal
        isOpen={true}
        onClose={onClose}
        creditsRequired={5}
        creditsAvailable={2}
      />
    );

    const buyBtn = screen.getByRole('button', { name: /Buy More Credits/i });
    fireEvent.click(buyBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
