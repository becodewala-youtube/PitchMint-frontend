import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, MemoryRouterProps, Routes, Route } from 'react-router-dom';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import ideaReducer from '@/features/ideas/store/ideaSlice';
import historyReducer from '@/features/dashboard/store/historySlice';
import creditsReducer from '@/features/credits/store/creditsSlice';
import type { RootState } from '@/app/store';

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      idea: ideaReducer,
      history: historyReducer,
      credits: creditsReducer,
    } as any,
    preloadedState: preloadedState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

export type AppStore = ReturnType<typeof createTestStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  route?: string;
  routePath?: string;
  initialEntries?: MemoryRouterProps['initialEntries'];
  routerInitialEntries?: MemoryRouterProps['initialEntries'];
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    route = '/',
    routePath,
    initialEntries,
    routerInitialEntries = initialEntries || [route],
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren): React.JSX.Element {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={routerInitialEntries}>
          {routePath ? (
            <Routes>
              <Route path={routePath} element={children} />
            </Routes>
          ) : (
            children
          )}
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
