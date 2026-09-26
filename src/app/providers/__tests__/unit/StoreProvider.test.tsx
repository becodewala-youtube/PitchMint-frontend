import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StoreProvider } from '@/app/providers';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const TestComponent = () => {
  const credits = useSelector((state: RootState) => state.auth.user?.credits ?? 'none');
  return <div data-testid="test-child">Credits: {credits}</div>;
};

describe('StoreProvider component', () => {
  it('provides Redux store context to child components', () => {
    render(
      <StoreProvider>
        <TestComponent />
      </StoreProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
