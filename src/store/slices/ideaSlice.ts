import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

// in ideaSlice.ts
export interface Feedback {
  rating: number;
  strengths: string[];
  improvements: string[]; // ✅ Add this
  additionalAdvice: string;
}

export interface Question {
  id: string; // ✅ Add this if possible; OR use _id and map it
  question: string;
  category: string;
  answer?: string;
  feedback?: Feedback | null;
}


export interface PitchSimulation {
  questions: Question[];
}

export interface Idea {
  competitorAnalysis: unknown;
  pitchSimulation: PitchSimulation;
  _id: string;
  ideaText: string;
  marketDemandScore: number;
  competitionScore: number;
  monetizationFeasibilityScore: number;
  overallScore: number;
  pitchDeckContent?: any;
  canvasContent?: any;
  createdAt: string;
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
}

const initialState: IdeaState = {
  ideas: [],
  currentIdea: null,
  loading: false,
  error: null,
  success: false,
};

// Submit Idea
export const submitIdea = createAsyncThunk(
  'idea/submit',
  async (ideaData: { ideaText: string }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/api/idea/submit`, ideaData, config);
      return response.data;
    } catch (error: any) {
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
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/api/pitchdeck/${id}`, {}, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate pitch deck');
    }
  }
);

// Generate Business Model Canvas
export const generateCanvas = createAsyncThunk(
  'idea/generateCanvas',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/api/canvas/${id}`, {}, config);
      return response.data;
    } catch (error: any) {
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
      })
      .addCase(submitIdea.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.loading = false;
        state.success = true;
        state.currentIdea = action.payload;
      })
      .addCase(submitIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      })
      .addCase(generatePitchDeck.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.loading = false;
        state.currentIdea = action.payload;
        state.success = true;
      })
      .addCase(generatePitchDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
      
      // Generate Canvas
      .addCase(generateCanvas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCanvas.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.loading = false;
        state.currentIdea = action.payload;
        state.success = true;
      })
      .addCase(generateCanvas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })




      
  }
});

export const { clearCurrentIdea, clearError, resetSuccess } = ideaSlice.actions;

export default ideaSlice.reducer;



