import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpgradeModal from '@/features/credits/components/UpgradeModal';
import { renderWithProviders } from '../../../../tests/setup/test-utils';
import api from '@/shared/lib/api';

vi.mock('@/shared/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('UpgradeModal component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    const { container } = renderWithProviders(<UpgradeModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal details when isOpen is true', () => {
    renderWithProviders(<UpgradeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument();
    expect(screen.getByText(/Access to investor directory/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upgrade Now - ₹29/i })).toBeInTheDocument();
  });

  it('calls onClose when close icon is clicked', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(<UpgradeModal isOpen={true} onClose={onClose} />);

    const closeBtn = container.querySelector('button');
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('handles demo upgrade success', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: reloadMock },
    });

    (api.post as any).mockResolvedValueOnce({
      data: { message: 'Successfully upgraded to Premium!' },
    });

    const onClose = vi.fn();
    renderWithProviders(<UpgradeModal isOpen={true} onClose={onClose} />);

    const demoBtn = screen.getByRole('button', { name: /Demo Upgrade/i });
    fireEvent.click(demoBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/payment/simulate-premium-success');
      expect(alertMock).toHaveBeenCalledWith('Successfully upgraded to Premium!');
      expect(onClose).toHaveBeenCalled();
      expect(reloadMock).toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });
});
