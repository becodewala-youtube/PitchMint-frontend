import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportAllSlidesToPDF, exportToPDF } from '@/shared/utils/pdfExport';
import { jsPDF } from 'jspdf';

const { mockPdfInstance } = vi.hoisted(() => {
  return {
    mockPdfInstance: {
      addPage: vi.fn(),
      setFillColor: vi.fn(),
      rect: vi.fn(),
      setTextColor: vi.fn(),
      setFontSize: vi.fn(),
      setFont: vi.fn(),
      getStringUnitWidth: vi.fn().mockReturnValue(5),
      text: vi.fn(),
      splitTextToSize: vi.fn().mockReturnValue(['line 1', 'line 2']),
      save: vi.fn(),
      internal: { scaleFactor: 1 },
    },
  };
});

vi.mock('jspdf', () => {
  const MockJsPDF = vi.fn(function () {
    return mockPdfInstance;
  });

  return {
    jsPDF: MockJsPDF,
  };
});

describe('pdfExport utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportToPDF (deprecated)', () => {
    it('throws deprecated error when called', async () => {
      await expect(exportToPDF()).rejects.toThrow('exportToPDF is deprecated');
    });
  });

  describe('exportAllSlidesToPDF', () => {
    it('generates a PDF with single slide and saves with filename', async () => {
      const slides = [{ title: 'Problem', content: 'High customer churn in SaaS' }];
      await exportAllSlidesToPDF(slides, 'test-deck');

      expect(jsPDF).toHaveBeenCalledWith('l', 'mm', 'a4');
      const pdf = (jsPDF as any).mock.results[0].value;
      expect(pdf.rect).toHaveBeenCalled();
      expect(pdf.text).toHaveBeenCalled();
      expect(pdf.save).toHaveBeenCalledWith('test-deck.pdf');
    });

    it('generates a multi-page PDF for multiple slides', async () => {
      const slides = [
        { title: 'Problem', content: 'Problem content' },
        { title: 'Solution', content: 'Solution content' },
        { title: 'Market', content: 'Market size' },
      ];
      await exportAllSlidesToPDF(slides, 'multi-slide');

      const pdf = (jsPDF as any).mock.results[0].value;
      expect(pdf.addPage).toHaveBeenCalledTimes(2);
      expect(pdf.save).toHaveBeenCalledWith('multi-slide.pdf');
    });

    it('handles slides with empty title or content gracefully', async () => {
      const slides = [{ title: '', content: '' }];
      await exportAllSlidesToPDF(slides, 'empty-slide');

      const pdf = (jsPDF as any).mock.results[0].value;
      expect(pdf.save).toHaveBeenCalledWith('empty-slide.pdf');
    });

    it('throws custom error when jsPDF save or rendering fails', async () => {
      const slides = [{ title: 'Failing', content: 'Will fail' }];
      mockPdfInstance.save.mockImplementationOnce(() => {
        throw new Error('Disk full');
      });

      await expect(exportAllSlidesToPDF(slides, 'fail-deck')).rejects.toThrow('Failed to generate PDF');
    });
  });
});
