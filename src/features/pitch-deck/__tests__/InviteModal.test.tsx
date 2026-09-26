import { screen, fireEvent, render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InviteModal from '@/features/pitch-deck/components/InviteModal';

describe('InviteModal component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <InviteModal isOpen={false} onClose={vi.fn()} onInvite={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content and triggers onInvite on click', () => {
    const onInvite = vi.fn();
    const onClose = vi.fn();

    render(<InviteModal isOpen={true} onClose={onClose} onInvite={onInvite} />);

    expect(screen.getByText('Invite Collaborators')).toBeInTheDocument();
    expect(
      screen.getByText(/Share this link with your team members to collaborate/i)
    ).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: /Copy Collaboration Link/i });
    fireEvent.click(copyBtn);
    expect(onInvite).toHaveBeenCalled();

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
