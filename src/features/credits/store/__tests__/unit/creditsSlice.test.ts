import { describe, it, expect, beforeEach, vi } from 'vitest';
import creditsReducer, {
  setError,
  setPurchasingPlan,
  fetchCreditPlans,
  fetchUserCreditsBalance,
  createCheckoutSession,
  verifyPayment,
  demoPurchase,
} from '@/features/credits/store/creditsSlice';
import api from '@/shared/lib/api';

vi.mock('@/shared/lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('creditsSlice reducer & async thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const initialState = {
    plans: {},
    availableCredits: 0,
    loading: false,
    error: null,
    purchasingPlan: null,
    fetchedOnce: false,
  };

  it('handles setError action', () => {
    const state = creditsReducer(initialState, setError('Card declined'));
    expect(state.error).toBe('Card declined');
  });

  it('handles setPurchasingPlan action', () => {
    const state = creditsReducer(initialState, setPurchasingPlan('pro-plan'));
    expect(state.purchasingPlan).toBe('pro-plan');
  });

  describe('fetchCreditPlans thunk', () => {
    it('fetches plans and sets fetchedOnce to true', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const mockPlans = {
        starter: { name: 'Starter', credits: 10, price: 99 },
        pro: { name: 'Pro', credits: 50, price: 399 },
      };
      (api.get as any).mockResolvedValueOnce({ data: mockPlans });

      const result = await fetchCreditPlans()(dispatch, getState, undefined);
      expect(api.get).toHaveBeenCalledWith('/api/credits/plans');
      expect(result.type).toBe('credits/fetchPlans/fulfilled');

      const nextState = creditsReducer(initialState, {
        type: fetchCreditPlans.fulfilled.type,
        payload: mockPlans,
      });
      expect(nextState.plans).toEqual(mockPlans);
      expect(nextState.fetchedOnce).toBe(true);
      expect(nextState.loading).toBe(false);
    });

    it('handles fetchCreditPlans rejection', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.get as any).mockRejectedValueOnce(new Error('Failed to load plans'));

      const result = await fetchCreditPlans()(dispatch, getState, undefined);
      expect(result.type).toBe('credits/fetchPlans/rejected');

      const nextState = creditsReducer(initialState, {
        type: fetchCreditPlans.rejected.type,
        payload: 'Failed to load plans',
      });
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Failed to load plans');
    });
  });

  describe('createCheckoutSession thunk', () => {
    it('creates checkout session successfully', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const sessionData = { orderId: 'order_123', amount: 9900 };
      (api.post as any).mockResolvedValueOnce({ data: sessionData });

      const result = await createCheckoutSession('starter')(dispatch, getState, undefined);
      expect(result.type).toBe('credits/createCheckout/fulfilled');
      expect(result.payload).toEqual(sessionData);
    });

    it('handles timeout error (ECONNABORTED)', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const timeoutError = { code: 'ECONNABORTED' };
      (api.post as any).mockRejectedValueOnce(timeoutError);

      const result = await createCheckoutSession('starter')(dispatch, getState, undefined);
      expect(result.type).toBe('credits/createCheckout/rejected');
      expect(result.payload).toContain('timed out');
    });

    it('handles network error (request with no response)', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const networkError = { request: {} };
      (api.post as any).mockRejectedValueOnce(networkError);

      const result = await createCheckoutSession('starter')(dispatch, getState, undefined);
      expect(result.type).toBe('credits/createCheckout/rejected');
      expect(result.payload).toContain('Network error');
    });
  });

  describe('verifyPayment thunk', () => {
    it('verifies razorpay payment and clears purchasingPlan on success', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const paymentData = {
        razorpay_order_id: 'order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: 'sig_1',
        planId: 'pro',
      };
      (api.post as any).mockResolvedValueOnce({ data: { success: true, credits: 50 } });

      const result = await verifyPayment(paymentData)(dispatch, getState, undefined);
      expect(result.type).toBe('credits/verifyPayment/fulfilled');

      const statePurchasing = { ...initialState, purchasingPlan: 'pro' };
      const nextState = creditsReducer(statePurchasing, {
        type: verifyPayment.fulfilled.type,
      });
      expect(nextState.purchasingPlan).toBeNull();
      expect(nextState.loading).toBe(false);
    });

    it('handles verifyPayment rejection', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockRejectedValueOnce(new Error('Signature verification failed'));

      const result = await verifyPayment({} as any)(dispatch, getState, undefined);
      expect(result.type).toBe('credits/verifyPayment/rejected');
    });
  });

  describe('demoPurchase thunk', () => {
    it('executes demo purchase successfully', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockResolvedValueOnce({ data: { credits: 25, purchased: 10 } });

      const result = await demoPurchase('starter')(dispatch, getState, undefined);
      expect(result.type).toBe('credits/demoPurchase/fulfilled');

      const nextState = creditsReducer(initialState, {
        type: demoPurchase.fulfilled.type,
      });
      expect(nextState.loading).toBe(false);
      expect(nextState.purchasingPlan).toBeNull();
    });

    it('handles demoPurchase rejection', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockRejectedValueOnce(new Error('Demo purchase disabled'));

      const result = await demoPurchase('starter')(dispatch, getState, undefined);
      expect(result.type).toBe('credits/demoPurchase/rejected');
    });
  });
});
