import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';


import { setAuthenticated } from '../store/slices/authSlice';


interface GoogleSignInProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const GoogleSignIn = ({ onSuccess, onError }: GoogleSignInProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'filled_black',
            size: 'medium',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        );
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [darkMode]);

 const handleCredentialResponse = async (response: any) => {
  try {
    const result = await api.post(`/api/auth/google`, {
      credential: response.credential,
    });

    // CRITICAL FIX: Store token in localStorage (do not store full user object)
    localStorage.setItem('token', result.data.token);

    // Update Redux store with authenticated state
    dispatch(setAuthenticated({
      token: result.data.token,
      user: result.data.user
    }));

    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/dashboard');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Google sign-in failed';
    if (onError) {
      onError(errorMessage);
    }
  }
};


  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full"></div>
    </div>
  );
};

export default GoogleSignIn;