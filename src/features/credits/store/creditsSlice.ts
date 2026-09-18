import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/shared/lib/api';

import { CreditPlans } from '../types/credit.types';

interface CreditsState {
  plans: CreditPlans;
  loading: boolean;
  error: string | null;
  fetchedOnce: boolean;
  purchasingPlan: string | null;
}

const initialState: CreditsState = {
  plans: {},
  loading: false,
  error: null,
  fetchedOnce: false,
  purchasingPlan: null,
};

// 🧠 Fetch credit plans
export const fetchCreditPlans = createAsyncThunk(
  'credits/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/credits/plans');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credit plans');
    }
  }
);

// 🧠 Fetch user credits balance
export const fetchUserCreditsBalance = createAsyncThunk(
  'credits/fetchBalance',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get('/api/credits/balance');
      const credits = response.data.credits;
      dispatch(updateUserCredits(credits));
      return credits;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user credits');
    }
  }
);

// 🧠 Create checkout session
export const createCheckoutSession = createAsyncThunk(
  'credits/createCheckout',
  async (planId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/api/credits/create-checkout-session',
        { planId },
        { timeout: 10000 }
      );
      return response.data;
    } catch (error: any) {
      let errorMessage = 'Purchase failed. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// 🧠 Verify payment
export const verifyPayment = createAsyncThunk(
  'credits/verifyPayment',
  async (
    paymentData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        '/api/credits/verify-payment',
        paymentData,
        { timeout: 15000 }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Payment verification failed. Please contact support if amount was debited.'
      );
    }
  }
);

// 🧠 Demo purchase (development only)
export const demoPurchase = createAsyncThunk(
  'credits/demoPurchase',
  async (planId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/api/credits/simulate-payment-success',
        { planId }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Demo purchase failed');
    }
  }
);

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPurchasingPlan: (state, action: PayloadAction<string | null>) => {
      state.purchasingPlan = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchCreditPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditPlans.fulfilled, (state, action: PayloadAction<CreditPlans>) => {
        state.loading = false;
        state.plans = action.payload;
        state.fetchedOnce = true;
      })
      .addCase(fetchCreditPlans.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Balance (Deprecated local state, ignored but fulfilled)
      .addCase(fetchUserCreditsBalance.fulfilled, () => {
        // Handled by auth slice or components reading from auth state
      })
      
      // Create Checkout
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCheckoutSession.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.purchasingPlan = null;
      })
      
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.purchasingPlan = null;
      })
      .addCase(verifyPayment.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.purchasingPlan = null;
      })
      
      // Demo Purchase
      .addCase(demoPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(demoPurchase.fulfilled, (state) => {
        state.loading = false;
        state.purchasingPlan = null;
      })
      .addCase(demoPurchase.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.purchasingPlan = null;
      });
  }
});

export const { setError, setPurchasingPlan } = creditsSlice.actions;

export default creditsSlice.reducer;