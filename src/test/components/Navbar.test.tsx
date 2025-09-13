import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../../components/layout/Navbar';
import authReducer from '../../store/slices/authSlice';
import ideaReducer from '../../store/slices/ideaSlice';
import { ThemeProvider } from '../../contexts/ThemeContext';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    idea: ideaReducer,
  },
  preloadedState: {
    auth: {
      user: {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        isPremium: false,
        credits: 5,
      },
      token: 'test-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    },
    idea: {
      ideas: [],
      currentIdea: null,
      loading: false,
      error: null,
      success: false,
      creditError: null,
    },
  },
});

const renderNavbar = () => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('Navbar', () => {
  test('renders navbar with user information', () => {
    renderNavbar();
    expect(screen.getByText('PitchMint')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Credits
  });

  test('shows tools dropdown when hovered', () => {
    renderNavbar();
    const toolsButton = screen.getByText('Tools');
    fireEvent.mouseEnter(toolsButton);
    expect(screen.getByText('Submit Idea')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  test('toggles dark mode', () => {
    renderNavbar();
    const darkModeButton = screen.getByRole('button', { name: /toggle dark mode/i });
    fireEvent.click(darkModeButton);
    // Test would check if dark mode class is applied
  });
});