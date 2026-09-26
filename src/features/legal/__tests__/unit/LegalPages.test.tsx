import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import About from '../../pages/About';
import Contact from '../../pages/Contact';
import HelpCenter from '../../pages/HelpCenter';
import NotFound from '../../pages/NotFound';
import PrivacyPolicy from '../../pages/PrivacyPolicy';
import TermsOfService from '../../pages/TermsOfService';
import RefundPolicy from '../../pages/RefundPolicy';
import ShippingPolicy from '../../pages/ShippingPolicy';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import emailjs from '@emailjs/browser';

vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));

describe('Legal and Information Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('About page', () => {
    it('renders mission, vision, and core values', () => {
      renderWithProviders(<About />);
      expect(screen.getByText('Our Story')).toBeInTheDocument();
      expect(screen.getByText('Our Values')).toBeInTheDocument();
      expect(screen.getByText('Entrepreneur-First')).toBeInTheDocument();
    });
  });

  describe('Contact page', () => {
    it('renders contact form fields', () => {
      renderWithProviders(<Contact />);
      expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Brief description of your inquiry')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Please provide details about your inquiry...')).toBeInTheDocument();
    });

    it('submits form via emailjs and shows success message', async () => {
      vi.mocked(emailjs.send).mockResolvedValueOnce({ status: 200, text: 'OK' } as any);

      renderWithProviders(<Contact />);

      fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Alice Smith' } });
      fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'alice@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Brief description of your inquiry'), { target: { value: 'Question about credits' } });
      fireEvent.change(screen.getByPlaceholderText('Please provide details about your inquiry...'), { target: { value: 'How do enterprise plans work?' } });

      const submitBtn = screen.getByRole('button', { name: /send message/i });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(emailjs.send).toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByText(/Message sent successfully!/i)).toBeInTheDocument();
      });
    });

    it('handles emailjs failure with alert', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      vi.mocked(emailjs.send).mockRejectedValueOnce(new Error('Network error'));

      renderWithProviders(<Contact />);

      fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Bob' } });
      fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'bob@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Brief description of your inquiry'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByPlaceholderText('Please provide details about your inquiry...'), { target: { value: 'Message' } });

      const submitBtn = screen.getByRole('button', { name: /send message/i });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled();
      });
    });
  });

  describe('HelpCenter page', () => {
    it('renders FAQ list and filters by search query', () => {
      renderWithProviders(<HelpCenter />);
      expect(screen.getByText('How do I submit my first startup idea?')).toBeInTheDocument();
      expect(screen.getByText('How do credits work?')).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText('Search for help articles...');
      fireEvent.change(searchInput, { target: { value: 'refund' } });

      expect(screen.getByText(/Can I get a refund for unused credits/i)).toBeInTheDocument();
      expect(screen.queryByText('How do I submit my first startup idea?')).not.toBeInTheDocument();
    });

    it('toggles FAQ item accordion open/close', () => {
      renderWithProviders(<HelpCenter />);

      const faqQuestion = screen.getByText('How do I submit my first startup idea?');
      fireEvent.click(faqQuestion);

      expect(screen.getByText(/Navigate to the 'Submit Idea' page/i)).toBeInTheDocument();

      // Click again to close
      fireEvent.click(faqQuestion);
      expect(screen.queryByText(/Navigate to the 'Submit Idea' page/i)).not.toBeInTheDocument();
    });
  });

  describe('NotFound page', () => {
    it('renders 404 message and navigation links', () => {
      renderWithProviders(<NotFound />);
      expect(screen.getByText('Error 404')).toBeInTheDocument();
      expect(screen.getByText('Lost in Space')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /return to base/i })).toBeInTheDocument();
    });
  });

  describe('PrivacyPolicy page', () => {
    it('renders privacy policy sections', () => {
      renderWithProviders(<PrivacyPolicy />);
      expect(screen.getByText('How We Use Your Information')).toBeInTheDocument();
      expect(screen.getByText('Data Security')).toBeInTheDocument();
      expect(screen.getByText('Your Rights')).toBeInTheDocument();
    });
  });

  describe('TermsOfService page', () => {
    it('renders terms of service sections', () => {
      renderWithProviders(<TermsOfService />);
      expect(screen.getByText('Limitation of Liability')).toBeInTheDocument();
    });
  });

  describe('RefundPolicy page', () => {
    it('renders refund policy details', () => {
      renderWithProviders(<RefundPolicy />);
      expect(screen.getByText('Cancellation Policy')).toBeInTheDocument();
      expect(screen.getByText('Our commitment to fair and transparent refunds')).toBeInTheDocument();
    });
  });

  describe('ShippingPolicy page', () => {
    it('renders shipping & delivery policy for digital goods', () => {
      renderWithProviders(<ShippingPolicy />);
      expect(screen.getByText('Delivery Policy')).toBeInTheDocument();
      expect(screen.getByText('Instant digital service delivery and access')).toBeInTheDocument();
    });
  });
});
