import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

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

// Get user from localStorage
let user: User | null = null;

try {
  const savedUser = localStorage.getItem('user');
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    user = JSON.parse(savedUser);
  }
} catch (error) {
  console.error('Error parsing user from localStorage:', error);
  localStorage.removeItem('user');
}

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

// Register User - NO TOKEN/USER STORAGE YET
export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      
      // ✅ DON'T store token/user yet - wait for email verification
      // Just return the response data
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || 'Registration failed');
    }
  }
);

// Login User
export const login = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, userData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Verify Email - Store token/user ONLY after verification
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationData: { email: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-email`, verificationData);
      
      // ✅ NOW store the token and user after successful verification
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);

// Load User
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      
      if (!state.auth.token) {
        return rejectWithValue('No token found');
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/api/auth/user`, config);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(error.response?.data.message || 'Failed to load user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
        localStorage.setItem('user', JSON.stringify(state.user));
      }
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
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
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

export const { logout, clearError, updateUserCredits } = authSlice.actions;

export default authSlice.reducer;