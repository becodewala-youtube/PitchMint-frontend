import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import { RootState } from '../index';
import { updateUserCredits } from './authSlice';

// 🧩 Types
export interface HistoryItem {
  _id: string;
  userId: string;
  serviceType: 'idea_validation' | 'investor_matching' | 'competitor_analysis' | 'market_research' | 'pitch_simulator';  // Add specific types
  title: string;
  description: string;
  creditsUsed: number;
  relatedIdeaId?: string | null;
  data: any;
  createdAt: string;
  __v: number;  // Add this field
}

interface HistoryState {
  history: HistoryItem[];
  loading: boolean;
  error: string | null;
  fetchedOnce: boolean;
}

const initialState: HistoryState = {
  history: [],
  loading: false,
  error: null,
  fetchedOnce: false, 
};

// 🧠 Fetch user history (with caching logic)
export const fetchUserHistory = createAsyncThunk(
  'history/fetchUserHistory',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('User not authenticated');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/api/history`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  },
);

// 🧠 Example: Add history item manually (optional)
export const addHistoryEntry = createAsyncThunk(
  'history/addHistoryEntry',
  async (
    historyData: {
      serviceType: string;
      title: string;
      description: string;
      data: any;
      creditsUsed: number;
    },
    { getState, rejectWithValue, dispatch },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${API_URL}/api/history`, historyData, config);

      // Update credits if returned
      if (response.data.userCredits !== undefined) {
        dispatch(updateUserCredits(response.data.userCredits));
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add history entry');
    }
  },
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.history = [];
      state.error = null;
      state.fetchedOnce = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch History
      .addCase(fetchUserHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserHistory.fulfilled, (state, action: PayloadAction<HistoryItem[]>) => {
        state.loading = false;
        state.history = action.payload;
        state.fetchedOnce = true; // ✅ Mark as fetched
      })
      .addCase(fetchUserHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Add History Entry (optional)
      .addCase(addHistoryEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHistoryEntry.fulfilled, (state, action: PayloadAction<HistoryItem>) => {
        state.loading = false;
        state.history.unshift(action.payload);
      })
      .addCase(addHistoryEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHistory } = historySlice.actions;
export default historySlice.reducer;
