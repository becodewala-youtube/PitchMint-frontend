import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import ideaReducer from '@/features/ideas/store/ideaSlice';
import historyReducer from '@/features/dashboard/store/historySlice';
import creditsReducer from '@/features/credits/store/creditsSlice';
import { onUnauthorized } from '@/shared/lib/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    idea: ideaReducer,
    history: historyReducer,
    credits: creditsReducer,
  },
});

onUnauthorized(() => {
  store.dispatch({ type: 'auth/logout' });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

