import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ideaReducer from './slices/ideaSlice';
import historyReducer from './slices/historySlice';
import creditsReducer from './slices/creditsSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    idea: ideaReducer,
    history: historyReducer,
    credits: creditsReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;