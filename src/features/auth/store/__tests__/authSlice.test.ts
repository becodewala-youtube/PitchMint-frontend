import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import authReducer, {
  logout,
  clearError,
  updateUserCredits,
  setAuthenticated,
  register,
  signin,
  verifyEmail,
  loadUser,
} from '@/features/auth/store/authSlice';
import api from '@/shared/lib/api';

vi.mock('@/shared/lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('authSlice reducer & actions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it('handles logout action', () => {
    localStorage.setItem('token', 'active-token');
    const loggedInState = {
      user: { _id: '1', name: 'User', email: 'test@test.com', isPremium: false, credits: 5 },
      token: 'active-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const nextState = authReducer(loggedInState, logout());
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.loading).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('handles clearError action', () => {
    const errorState = { ...initialState, error: 'Some error' };
    const nextState = authReducer(errorState, clearError());
    expect(nextState.error).toBeNull();
  });

  it('handles updateUserCredits action', () => {
    const userState = {
      ...initialState,
      user: { _id: '1', name: 'User', email: 'test@test.com', isPremium: false, credits: 5 },
    };

    const nextState = authReducer(userState, updateUserCredits(10));
    expect(nextState.user?.credits).toBe(10);
  });

  it('does nothing in updateUserCredits if user is null', () => {
    const nextState = authReducer(initialState, updateUserCredits(10));
    expect(nextState.user).toBeNull();
  });

  it('handles setAuthenticated action', () => {
    const user = { _id: '1', name: 'OAuth User', email: 'oauth@test.com', isPremium: true, credits: 20 };
    const nextState = authReducer(
      initialState,
      setAuthenticated({ token: 'oauth-token', user })
    );

    expect(nextState.token).toBe('oauth-token');
    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  describe('register async thunk', () => {
    it('dispatches register.fulfilled without authenticating (waits for email verification)', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockResolvedValueOnce({ data: { message: 'Verification email sent' } });

      const result = await register({ name: 'New User', email: 'new@test.com', password: 'password123' })(
        dispatch,
        getState,
        undefined
      );

      expect(api.post).toHaveBeenCalledWith('/api/auth/register', {
        name: 'New User',
        email: 'new@test.com',
        password: 'password123',
      });
      expect(result.type).toBe('auth/register/fulfilled');

      const nextState = authReducer(initialState, { type: register.fulfilled.type });
      expect(nextState.loading).toBe(false);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.token).toBeNull();
    });

    it('handles register.rejected', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockRejectedValueOnce({
        response: { data: { message: 'Email already registered' } },
      });

      const result = await register({ name: 'User', email: 'exist@test.com', password: 'pass' })(
        dispatch,
        getState,
        undefined
      );

      expect(result.type).toBe('auth/register/rejected');
      expect(result.payload).toBe('Email already registered');

      const nextState = authReducer(initialState, {
        type: register.rejected.type,
        payload: 'Email already registered',
      });
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Email already registered');
    });
  });

  describe('signin async thunk', () => {
    it('handles successful signin and stores token in localStorage', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const mockUserData = {
        token: 'auth-jwt-token',
        user: { _id: '1', name: 'User', email: 'test@test.com', isPremium: false, credits: 5 },
      };
      (api.post as any).mockResolvedValueOnce({ data: mockUserData });

      const result = await signin({ email: 'test@test.com', password: 'password' })(
        dispatch,
        getState,
        undefined
      );

      expect(result.type).toBe('auth/signin/fulfilled');
      expect(localStorage.getItem('token')).toBe('auth-jwt-token');

      const nextState = authReducer(initialState, {
        type: signin.fulfilled.type,
        payload: mockUserData,
      });
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.token).toBe('auth-jwt-token');
      expect(nextState.user).toEqual(mockUserData.user);
    });

    it('handles signin.rejected on invalid credentials', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockRejectedValueOnce({
        response: { data: { message: 'Invalid email or password' } },
      });

      const result = await signin({ email: 'test@test.com', password: 'wrong' })(
        dispatch,
        getState,
        undefined
      );

      expect(result.type).toBe('auth/signin/rejected');
      expect(result.payload).toBe('Invalid email or password');

      const nextState = authReducer(initialState, {
        type: signin.rejected.type,
        payload: 'Invalid email or password',
      });
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Invalid email or password');
    });
  });

  describe('verifyEmail async thunk', () => {
    it('verifies email, stores token, and authenticates user', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const mockVerified = {
        token: 'verified-token',
        user: { _id: '1', name: 'Verified', email: 'v@test.com', isPremium: false, credits: 5 },
      };
      (api.post as any).mockResolvedValueOnce({ data: mockVerified });

      const result = await verifyEmail({ email: 'v@test.com', token: 'verification-code' })(
        dispatch,
        getState,
        undefined
      );

      expect(result.type).toBe('auth/verifyEmail/fulfilled');
      expect(localStorage.getItem('token')).toBe('verified-token');

      const nextState = authReducer(initialState, {
        type: verifyEmail.fulfilled.type,
        payload: mockVerified,
      });
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.token).toBe('verified-token');
    });

    it('handles verifyEmail.rejected on invalid token', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockRejectedValueOnce({
        response: { data: { message: 'Token has expired' } },
      });

      const result = await verifyEmail({ email: 'v@test.com', token: 'expired' })(
        dispatch,
        getState,
        undefined
      );

      expect(result.type).toBe('auth/verifyEmail/rejected');
      expect(result.payload).toBe('Token has expired');
    });
  });

  describe('loadUser async thunk', () => {
    it('loads current user when token exists in state', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        auth: { token: 'saved-token' },
      }));
      const user = { _id: '1', name: 'Loaded User', email: 'l@test.com', isPremium: true, credits: 15 };
      (api.get as any).mockResolvedValueOnce({ data: user });

      const result = await loadUser()(dispatch, getState, undefined);

      expect(api.get).toHaveBeenCalledWith('/api/auth/user');
      expect(result.type).toBe('auth/loadUser/fulfilled');

      const nextState = authReducer(
        { ...initialState, token: 'saved-token' },
        { type: loadUser.fulfilled.type, payload: user }
      );
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.user).toEqual(user);
    });

    it('rejects with "No token found" when state has no token', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        auth: { token: null },
      }));

      const result = await loadUser()(dispatch, getState, undefined);
      expect(result.type).toBe('auth/loadUser/rejected');
      expect(result.payload).toBe('No token found');
    });

    it('removes token from localStorage and unauthenticates when API returns error', async () => {
      localStorage.setItem('token', 'invalid-token');
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        auth: { token: 'invalid-token' },
      }));
      (api.get as any).mockRejectedValueOnce(new Error('Session invalid'));

      const result = await loadUser()(dispatch, getState, undefined);

      expect(result.type).toBe('auth/loadUser/rejected');
      expect(localStorage.getItem('token')).toBeNull();

      const nextState = authReducer(
        { ...initialState, token: 'invalid-token', isAuthenticated: true },
        { type: loadUser.rejected.type, payload: 'Session invalid' }
      );
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.error).toBe('Session invalid');
    });
  });
});
