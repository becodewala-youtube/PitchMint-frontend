import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageBackground from '@/shared/components/ui/PageBackground';

describe('PageBackground component', () => {
  it('renders default violet theme with gradient orbs and grid', () => {
    const { container } = render(<PageBackground />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.innerHTML).toContain('from-violet-600/30');
  });

  it('renders themes correctly', () => {
    const themes: Array<'amber' | 'emerald' | 'blue' | 'orange' | 'cyan' | 'purple' | 'red'> = [
      'amber',
      'emerald',
      'blue',
      'orange',
      'cyan',
      'purple',
      'red',
    ];

    for (const theme of themes) {
      const { container } = render(<PageBackground theme={theme} />);
      expect(container.innerHTML).toContain(`from-${theme}-600/30`);
    }
  });

  it('falls back to violet theme if unknown theme is passed', () => {
    const { container } = render(<PageBackground theme={'unknown' as any} />);
    expect(container.innerHTML).toContain('from-violet-600/30');
  });
});
