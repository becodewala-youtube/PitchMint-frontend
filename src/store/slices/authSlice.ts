import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

interface User {
  _id: string;
  name: string;
  email: string;
  isPremium: boolean;
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
const savedUser = localStorage.getItem('user');
const user = savedUser ? JSON.parse(savedUser) : null;

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

// Register User
export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData, {
        withCredentials: true,
      });
      
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
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
      const response = await axios.post(`${API_URL}/api/auth/login`, userData, {
        withCredentials: true,
      });
      
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || 'Login failed');
    }
  }
);

// Load User
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        },
        withCredentials: true,
      };
      
      const response = await axios.get(`${API_URL}/api/auth/user`, config);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
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

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;