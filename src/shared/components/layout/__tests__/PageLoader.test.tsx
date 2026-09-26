import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageLoader from '@/shared/components/layout/PageLoader';

describe('PageLoader component', () => {
  it('renders a spinner animation container', () => {
    const { container } = render(<PageLoader />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
