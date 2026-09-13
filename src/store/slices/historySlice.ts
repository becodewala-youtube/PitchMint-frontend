import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { RootState } from '../index';
import { updateUserCredits } from './authSlice';

// 🧩 Data Types for Services
export interface IdeaValidationData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  marketPotential: string;
  technicalFeasibility: string;
  monetizationStrategy: string;
}

export interface PitchSimulatorData {
  score: number;
  feedback: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  investorQuestions: string[];
}

export interface InvestorMatch {
  name: string;
  type: string;
  location: string;
  matchScore: number;
  portfolioSize?: number;
  description: string;
  investmentRange?: { min: number; max: number };
  industryFocus?: string[];
  matchReasons?: string[];
  recentInvestments?: string[];
  contactLink?: string;
}

export interface InvestorMatchingData {
  matches: InvestorMatch[];
}

export interface CompetitorSwot {
  strengths: string[];
  opportunities: string[];
  weaknesses: string[];
  threats: string[];
}

export interface Competitor {
  name: string;
  description: string;
  swot: CompetitorSwot;
}

export interface CompetitorAnalysisData {
  summary: string;
  competitors: Competitor[];
}

export interface MarketResearchData {
  tam: { value: number };
  sam: { value: number };
  som: { value: number };
  trends: { name: string; impact: string; description: string }[];
  demographics: { segment: string; size: string; characteristics: string[] }[];
}

// 🧩 Types
export interface BaseHistoryItem {
  _id: string;
  userId: string;
  title: string;
  description: string;
  creditsUsed: number;
  relatedIdeaId?: string | null;
  createdAt: string;
  __v: number;
}

export type HistoryItem = BaseHistoryItem & (
  | { serviceType: 'idea_validation'; data: IdeaValidationData }
  | { serviceType: 'investor_matching'; data: InvestorMatchingData }
  | { serviceType: 'competitor_analysis'; data: CompetitorAnalysisData }
  | { serviceType: 'market_research'; data: MarketResearchData }
  | { serviceType: 'pitch_simulator'; data: PitchSimulatorData }
);
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/history');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  },
);

// 🧠 Add history item manually
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
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post('/api/history', historyData);

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
