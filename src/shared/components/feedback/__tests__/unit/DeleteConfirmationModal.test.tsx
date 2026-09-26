import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteConfirmationModal from '@/shared/components/feedback/DeleteConfirmationModal';
import { renderWithProviders } from '../../../../../../tests/setup/test-utils';

describe('DeleteConfirmationModal component', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = renderWithProviders(
      <DeleteConfirmationModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} loading={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    renderWithProviders(
      <DeleteConfirmationModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} loading={false} />
    );

    expect(screen.getByText('Delete Idea')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this idea/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('triggers onConfirm when Delete button is clicked', () => {
    const onConfirmMock = vi.fn();
    renderWithProviders(
      <DeleteConfirmationModal isOpen={true} onClose={vi.fn()} onConfirm={onConfirmMock} loading={false} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when Cancel button or close icon is clicked', () => {
    const onCloseMock = vi.fn();
    renderWithProviders(
      <DeleteConfirmationModal isOpen={true} onClose={onCloseMock} onConfirm={vi.fn()} loading={false} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('disables Delete button and shows loading text while loading', () => {
    renderWithProviders(
      <DeleteConfirmationModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} loading={true} />
    );

    const deleteBtn = screen.getByRole('button', { name: 'Deleting...' });
    expect(deleteBtn).toBeDisabled();
  });
});
