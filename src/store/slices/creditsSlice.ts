import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import { RootState } from '../index';

// 🧩 Types
export interface CreditPlan {
  name: string;
  credits: number;
  price: number;
  description: string;
}

export interface CreditPlans {
  [key: string]: CreditPlan;
}

interface CreditsState {
  plans: CreditPlans;
  userCredits: number;
  loading: boolean;
  error: string | null;
  fetchedOnce: boolean;
  purchasingPlan: string | null;
}

const initialState: CreditsState = {
  plans: {},
  userCredits: 0,
  loading: false,
  error: null,
  fetchedOnce: false,
  purchasingPlan: null,
};

// 🧠 Fetch credit plans
export const fetchCreditPlans = createAsyncThunk(
  'credits/fetchPlans',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/api/credits/plans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credit plans');
    }
  }
);

// 🧠 Fetch user credits balance
export const fetchUserCreditsBalance = createAsyncThunk(
  'credits/fetchBalance',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/api/credits/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.credits;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user credits');
    }
  }
);

// 🧠 Create checkout session
export const createCheckoutSession = createAsyncThunk(
  'credits/createCheckout',
  async (planId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const response = await axios.post(
        `${API_URL}/api/credits/create-checkout-session`,
        { planId },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
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
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const response = await axios.post(
        `${API_URL}/api/credits/verify-payment`,
        paymentData,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000
        }
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
  async (planId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const response = await axios.post(
        `${API_URL}/api/credits/simulate-payment-success`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
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
    },
    updateUserCredits: (state, action: PayloadAction<number>) => {
      state.userCredits = action.payload;
    },
    clearCreditsData: (state) => {
      state.plans = {};
      state.userCredits = 0;
      state.error = null;
      state.fetchedOnce = false;
      state.purchasingPlan = null;
    },
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
      .addCase(fetchCreditPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Balance
      .addCase(fetchUserCreditsBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCreditsBalance.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.userCredits = action.payload;
      })
      .addCase(fetchUserCreditsBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Checkout
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.purchasingPlan = null;
      })

      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.userCredits = action.payload.credits;
        state.purchasingPlan = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.purchasingPlan = null;
      })

      // Demo Purchase
      .addCase(demoPurchase.pending, (state) => {
        state.loading = true;
      })
      .addCase(demoPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.userCredits = action.payload.credits;
        state.purchasingPlan = null;
      })
      .addCase(demoPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.purchasingPlan = null;
      });
  },
});

export const { setError, setPurchasingPlan, updateUserCredits, clearCreditsData } = creditsSlice.actions;
export default creditsSlice.reducer;