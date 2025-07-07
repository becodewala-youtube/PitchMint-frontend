import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import { updateUserCredits } from './authSlice';

interface Idea {
  _id: string;
  ideaText: string;
  marketDemandScore: number;
  competitionScore: number;
  monetizationFeasibilityScore: number;
  overallScore: number;
  pitchDeckContent?: any;
  canvasContent?: any;
  competitorAnalysis?: any;
  pitchSimulation?: any;
  createdAt: string;
  userCredits?: number;
  analysis: {
    marketDemand: { score: number; text: string };
    competition: { score: number; text: string };
    monetization: { score: number; text: string };
    overall: { score: number; text: string };
  };
}

interface IdeaState {
  ideas: Idea[];
  currentIdea: Idea | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  creditError: {
    show: boolean;
    creditsRequired: number;
    creditsAvailable: number;
  } | null;
}

const initialState: IdeaState = {
  ideas: [],
  currentIdea: null,
  loading: false,
  error: null,
  success: false,
  creditError: null,
};

// Submit Idea
export const submitIdea = createAsyncThunk(
  'idea/submit',
  async (ideaData: { ideaText: string }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/api/idea/submit`, ideaData, config);
      
      // Update user credits in auth state if returned
      if (response.data.userCredits !== undefined) {
        dispatch(updateUserCredits(response.data.userCredits));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 402) {
        return rejectWithValue({
          message: error.response.data.message,
          creditError: {
            creditsRequired: error.response.data.creditsRequired,
            creditsAvailable: error.response.data.creditsAvailable
          }
        });
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to submit idea');
    }
  }
);

// Get Idea by ID
export const getIdea = createAsyncThunk(
  'idea/getById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/api/idea/${id}`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get idea');
    }
  }
);

// Get Saved Ideas
export const getSavedIdeas = createAsyncThunk(
  'idea/getSaved',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/api/idea/saved`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get saved ideas');
    }
  }
);

// Delete Idea
export const deleteIdea = createAsyncThunk(
  'idea/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      await axios.delete(`${API_URL}/api/idea/${id}`, config);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete idea');
    }
  }
);

// Generate Pitch Deck
export const generatePitchDeck = createAsyncThunk(
  'idea/generatePitchDeck',
  async (id: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/api/pitchdeck/${id}`, {}, config);
      
      // Update user credits in auth state
      if (state.auth.user) {
        dispatch(updateUserCredits(Math.max(0, state.auth.user.credits - 1)));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 402) {
        return rejectWithValue({
          message: error.response.data.message,
          creditError: {
            creditsRequired: error.response.data.creditsRequired,
            creditsAvailable: error.response.data.creditsAvailable
          }
        });
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to generate pitch deck');
    }
  }
);

// Generate Business Model Canvas
export const generateCanvas = createAsyncThunk(
  'idea/generateCanvas',
  async (id: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/api/canvas/${id}`, {}, config);
      
      // Update user credits in auth state
      if (state.auth.user) {
        dispatch(updateUserCredits(Math.max(0, state.auth.user.credits - 1)));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 402) {
        return rejectWithValue({
          message: error.response.data.message,
          creditError: {
            creditsRequired: error.response.data.creditsRequired,
            creditsAvailable: error.response.data.creditsAvailable
          }
        });
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to generate canvas');
    }
  }
);

const ideaSlice = createSlice({
  name: 'idea',
  initialState,
  reducers: {
    clearCurrentIdea: (state) => {
      state.currentIdea = null;
    },
    clearError: (state) => {
      state.error = null;
      state.creditError = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit Idea
      .addCase(submitIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.creditError = null;
      })
      .addCase(submitIdea.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.loading = false;
        state.success = true;
        state.currentIdea = action.payload;
      })
      .addCase(submitIdea.rejected, (state, action: any) => {
        state.loading = false;
        if (action.payload?.creditError) {
          state.creditError = {
            show: true,
            creditsRequired: action.payload.creditError.creditsRequired,
            creditsAvailable: action.payload.creditError.creditsAvailable
          };
        } else {
          state.error = action.payload?.message || action.payload;
        }
      })
      
      // Get Idea by ID
      .addCase(getIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIdea.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.loading = false;
        state.currentIdea = action.payload;
      })
      .addCase(getIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get Saved Ideas
      .addCase(getSavedIdeas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavedIdeas.fulfilled, (state, action: PayloadAction<Idea[]>) => {
        state.loading = false;
        state.ideas = action.payload;
      })
      .addCase(getSavedIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Idea
      .addCase(deleteIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIdea.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.ideas = state.ideas.filter(idea => idea._id !== action.payload);
        if (state.currentIdea?._id === action.payload) {
          state.currentIdea = null;
        }
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Generate Pitch Deck
      .addCase(generatePitchDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.creditError = null;
      })
      .addCase(generatePitchDeck.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.loading = false;
        state.currentIdea = action.payload;
        state.success = true;
      })
      .addCase(generatePitchDeck.rejected, (state, action: any) => {
        state.loading = false;
        if (action.payload?.creditError) {
          state.creditError = {
            show: true,
            creditsRequired: action.payload.creditError.creditsRequired,
            creditsAvailable: action.payload.creditError.creditsAvailable
          };
        } else {
          state.error = action.payload?.message || action.payload;
        }
      })
      
      // Generate Canvas
      .addCase(generateCanvas.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.creditError = null;
      })
      .addCase(generateCanvas.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.loading = false;
        state.currentIdea = action.payload;
        state.success = true;
      })
      .addCase(generateCanvas.rejected, (state, action: any) => {
        state.loading = false;
        if (action.payload?.creditError) {
          state.creditError = {
            show: true,
            creditsRequired: action.payload.creditError.creditsRequired,
            creditsAvailable: action.payload.creditError.creditsAvailable
          };
        } else {
          state.error = action.payload?.message || action.payload;
        }
      });
  }
});

export const { clearCurrentIdea, clearError, resetSuccess } = ideaSlice.actions;

export default ideaSlice.reducer;