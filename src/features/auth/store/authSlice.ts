import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/shared/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  isPremium: boolean;
  credits: number;
  profilePicture?: string;
  authProvider?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Get token from localStorage
const token = localStorage.getItem('token');

// Don't get user from localStorage - let loadUser handle it to prevent PII leakage
const initialState: AuthState = {
  user: null,
  token,
  isAuthenticated: !!token,
  loading: !!token,
  error: null,
};

// Register User - NO TOKEN/USER STORAGE YET
export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/auth/register`, userData);
      
      // ✅ DON'T store token/user yet - wait for email verification
      // Just return the response data
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Registration failed'));
    }
  }
);

// Sign In User
export const signin = createAsyncThunk(
  'auth/signin',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/auth/signin`, userData);
      
      localStorage.setItem('token', response.data.token);
      
      return response.data;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Sign in failed');
      return rejectWithValue(message);
    }
  }
);

// Export login alias for backwards compatibility
export const login = signin;

// Verify Email - Store token/user ONLY after verification
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationData: { email: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/auth/verify-email`, verificationData);
      
      // ✅ NOW store the token after successful verification
      localStorage.setItem('token', response.data.token);
      
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Verification failed'));
    }
  }
);

// Load User
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      
      if (!state.auth.token) {
        return rejectWithValue('No token found');
      }
      
      // Let the api client handle auth headers via interceptors, but we can pass it if we want.
      // The shared api client already adds the token from localStorage automatically.
      const response = await api.get(`/api/auth/user`);
      
      return response.data;
    } catch (error: unknown) {
      localStorage.removeItem('token');
      return rejectWithValue(getErrorMessage(error, 'Failed to load user'));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserCredits: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.credits = action.payload;
      }
    },
    setAuthenticated: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register - DON'T set authenticated yet
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        // ✅ Just set loading to false - don't authenticate yet
        state.loading = false;
        state.error = null;
        // User will be authenticated after email verification
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Verify Email - NOW set authenticated
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Sign In
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, clearError, updateUserCredits, setAuthenticated } = authSlice.actions;

export default authSlice.reducer;