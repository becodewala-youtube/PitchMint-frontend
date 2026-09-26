import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRazorpay } from '@/features/credits/hooks/useRazorpay';
import api from '@/shared/lib/api';

vi.mock('@/shared/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useRazorpay hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).Razorpay;
  });

  it('sets error and calls onError if window.Razorpay is undefined on initiate', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useRazorpay({
        createSessionEndpoint: '/api/session',
        verifyPaymentEndpoint: '/api/verify',
        onSuccess,
        onError,
      })
    );

    await act(async () => {
      await result.current.initiatePayment();
    });

    expect(result.current.error).toBe('Payment gateway not loaded. Please refresh the page.');
    expect(onError).toHaveBeenCalled();
  });

  it('initiates Razorpay checkout workflow when Razorpay SDK is available', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const mockOpen = vi.fn();
    const mockOn = vi.fn();

    let capturedOptions: any = null;
    const MockRazorpay = vi.fn().mockImplementation(function (options: any) {
      capturedOptions = options;
      return {
        open: mockOpen,
        on: mockOn,
      };
    });

    (window as any).Razorpay = MockRazorpay;

    (api.post as any).mockResolvedValueOnce({
      data: {
        orderId: 'order_123',
        amount: 50000,
        currency: 'INR',
        keyId: 'rzp_test_key',
        userEmail: 'user@test.com',
        userName: 'Test User',
      },
    });

    const { result } = renderHook(() =>
      useRazorpay({
        createSessionEndpoint: '/api/create-session',
        verifyPaymentEndpoint: '/api/verify-payment',
        onSuccess,
        onError,
      })
    );

    await act(async () => {
      await result.current.initiatePayment({ planId: 'starter' });
    });

    expect(api.post).toHaveBeenCalledWith('/api/create-session', { planId: 'starter' });
    expect(MockRazorpay).toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalled();
    expect(capturedOptions.order_id).toBe('order_123');

    // Simulate successful payment handler
    (api.post as any).mockResolvedValueOnce({
      data: { success: true, credits: 10 },
    });

    await act(async () => {
      await capturedOptions.handler({
        razorpay_order_id: 'order_123',
        razorpay_payment_id: 'pay_456',
        razorpay_signature: 'sig_789',
      });
    });

    expect(api.post).toHaveBeenCalledWith(
      '/api/verify-payment',
      {
        razorpay_order_id: 'order_123',
        razorpay_payment_id: 'pay_456',
        razorpay_signature: 'sig_789',
      },
      { timeout: 15000 }
    );
    expect(onSuccess).toHaveBeenCalledWith({ success: true, credits: 10 });
  });

  it('handles payment verification failure in Razorpay handler', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    let capturedOptions: any = null;

    (window as any).Razorpay = vi.fn().mockImplementation(function (options: any) {
      capturedOptions = options;
      return {
        open: vi.fn(),
        on: vi.fn(),
      };
    });

    (api.post as any).mockResolvedValueOnce({
      data: {
        orderId: 'order_fail',
        amount: 2000,
        currency: 'INR',
        keyId: 'key',
      },
    });

    const { result } = renderHook(() =>
      useRazorpay({
        createSessionEndpoint: '/api/create-session',
        verifyPaymentEndpoint: '/api/verify-payment',
        onSuccess,
        onError,
      })
    );

    await act(async () => {
      await result.current.initiatePayment();
    });

    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: 'Invalid payment signature' } },
    });

    await act(async () => {
      await capturedOptions.handler({
        razorpay_order_id: 'order_fail',
        razorpay_payment_id: 'pay_fail',
        razorpay_signature: 'bad_sig',
      });
    });

    expect(result.current.error).toBe('Invalid payment signature');
    expect(onError).toHaveBeenCalled();
  });
});
