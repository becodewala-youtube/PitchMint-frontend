import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SubmitIdea from '../../pages/SubmitIdea';
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
      user: { _id: '1', name: 'Test User', email: 'test@example.com', isPremium: false, credits: 5 },
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

const renderSubmitIdea = () => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <ThemeProvider>
          <SubmitIdea />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('SubmitIdea', () => {
  test('renders submit idea form', () => {
    renderSubmitIdea();
    expect(screen.getByText('Submit Your')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe your startup idea/i)).toBeInTheDocument();
  });

  test('enables submit button when idea text is entered', () => {
    renderSubmitIdea();
    const textarea = screen.getByPlaceholderText(/describe your startup idea/i);
    const submitButton = screen.getByText('Analyze Idea (1 Credit)');
    
    expect(submitButton).toBeDisabled();
    
    fireEvent.change(textarea, { target: { value: 'My startup idea' } });
    expect(submitButton).toBeEnabled();
  });

  test('shows credit requirement in button text', () => {
    renderSubmitIdea();
    expect(screen.getByText('Analyze Idea (1 Credit)')).toBeInTheDocument();
  });
});