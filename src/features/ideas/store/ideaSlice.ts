import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/shared/lib/api';
import { updateUserCredits } from '@/features/auth/store/authSlice';

interface Idea {
  _id: string;
  ideaText: string;
  marketDemandScore: number;
  competitionScore: number;
  monetizationFeasibilityScore: number;
  overallScore: number;
  pitchDeckContent?: Record<string, unknown>;
  canvasContent?: Record<string, unknown>;
  competitorAnalysis?: Record<string, unknown>;
  pitchSimulation?: Record<string, unknown>;
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
  creditError: null,
};

// Submit Idea
export const submitIdea = createAsyncThunk(
  'idea/submit',
  async (ideaData: { ideaText: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/api/idea/submit', ideaData);
      
      // Update user credits in auth state if returned
      if (response.data.userCredits !== undefined) {
        dispatch(updateUserCredits(response.data.userCredits));
      }
      
      return response.data;
    } catch (error: unknown) {
      if (error.response?.status === 402) {
        return rejectWithValue({
          message: error.response.data.message,
          creditError: {
            creditsRequired: error.response.data.creditsRequired,
            creditsAvailable: error.response.data.creditsAvailable
          }
        });
      }
      return rejectWithValue(getErrorMessage(error, 'Failed to submit idea'));
    }
  }
);

// Get Idea by ID
export const getIdea = createAsyncThunk(
  'idea/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/idea/${id}`);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to get idea'));
    }
  }
);

// Get Saved Ideas
export const getSavedIdeas = createAsyncThunk(
  'idea/getSaved',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/idea/saved');
      return response.data.ideas || [];
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to get saved ideas'));
    }
  }
);

// Delete Idea
export const deleteIdea = createAsyncThunk(
  'idea/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/idea/${id}`);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete idea'));
    }
  }
);

// Generate Pitch Deck
export const generatePitchDeck = createAsyncThunk(
  'idea/generatePitchDeck',
  async (id: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/api/pitchdeck/${id}`, {});
      
      const state = getState() as { auth: { token: string | null } };
      // Update user credits in auth state
      if (state.auth.user) {
        dispatch(updateUserCredits(Math.max(0, state.auth.user.credits - 1)));
      }
      
      return response.data;
    } catch (error: unknown) {
      if (error.response?.status === 402) {
        return rejectWithValue({
          message: error.response.data.message,
          creditError: {
            creditsRequired: error.response.data.creditsRequired,
            creditsAvailable: error.response.data.creditsAvailable
          }
        });
      }
      return rejectWithValue(getErrorMessage(error, 'Failed to generate pitch deck'));
    }
  }
);

// Generate Business Model Canvas
export const generateCanvas = createAsyncThunk(
  'idea/generateCanvas',
  async (id: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/api/canvas/${id}`, {});
      
      const state = getState() as { auth: { token: string | null } };
      // Update user credits in auth state
      if (state.auth.user) {
        dispatch(updateUserCredits(Math.max(0, state.auth.user.credits - 1)));
      }
      
      return response.data;
    } catch (error: unknown) {
      if (error.response?.status === 402) {
        return rejectWithValue({
          message: error.response.data.message,
          creditError: {
            creditsRequired: error.response.data.creditsRequired,
            creditsAvailable: error.response.data.creditsAvailable
          }
        });
      }
      return rejectWithValue(getErrorMessage(error, 'Failed to generate canvas'));
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
        state.currentIdea = action.payload;
      })
      .addCase(submitIdea.rejected, (state, action) => {
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
      })
      .addCase(generatePitchDeck.rejected, (state, action) => {
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
      })
      .addCase(generateCanvas.rejected, (state, action) => {
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

export const { clearCurrentIdea, clearError } = ideaSlice.actions;

export default ideaSlice.reducer;