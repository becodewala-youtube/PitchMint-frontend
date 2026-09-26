import { screen, fireEvent, render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SlideThumbnails from '@/features/pitch-deck/components/SlideThumbnails';

describe('SlideThumbnails component', () => {
  const mockSlides = [
    { title: 'Problem', content: 'Problem statement' },
    { title: 'Solution', content: 'Solution statement' },
    { title: 'Business Model', content: 'Revenue streams' },
  ];

  it('does not render if slides array is empty', () => {
    const { container } = render(
      <SlideThumbnails slides={[]} currentSlide={0} setCurrentSlide={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders all slide titles and count', () => {
    render(
      <SlideThumbnails slides={mockSlides} currentSlide={0} setCurrentSlide={vi.fn()} />
    );

    expect(screen.getByText('All Slides')).toBeInTheDocument();
    expect(screen.getByText('3 slides total')).toBeInTheDocument();
    expect(screen.getByText('Problem')).toBeInTheDocument();
    expect(screen.getByText('Solution')).toBeInTheDocument();
    expect(screen.getByText('Business Model')).toBeInTheDocument();
  });

  it('calls setCurrentSlide with the clicked slide index', () => {
    const setCurrentSlide = vi.fn();
    render(
      <SlideThumbnails slides={mockSlides} currentSlide={0} setCurrentSlide={setCurrentSlide} />
    );

    const solutionBtn = screen.getByText('Solution').closest('button');
    if (solutionBtn) {
      fireEvent.click(solutionBtn);
      expect(setCurrentSlide).toHaveBeenCalledWith(1);
    }
  });
});
