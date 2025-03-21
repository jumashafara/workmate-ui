import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { googleAuthenticate } from '../../api/Auth';
import { toast } from 'react-toastify';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

const GoogleCallback: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      
      if (!code) {
        setError('No authorization code received from Google');
        setLoading(false);
        return;
      }
      
      try {
        const data = await googleAuthenticate(code);
        
        // Save the tokens
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("fullname", data.user.full_name);
        localStorage.setItem("superuser", `${data.user.is_superuser}`);
        
        toast.success("Google login successful! Redirecting...");
        
        // Redirect to home page
        navigate('/');
      } catch (error: any) {
        console.error('Google authentication error:', error);
        setError(error.message || 'Failed to authenticate with Google');
        setLoading(false);
        toast.error(error.message || 'Failed to authenticate with Google');
      }
    };
    
    handleGoogleCallback();
  }, [location, navigate]);

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          p: 4
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={60} sx={{ mb: 4, color: '#ea580c' }} />
            <Typography variant="h5" component="h1" gutterBottom>
              Completing Google Authentication
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we authenticate your account...
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" component="h1" color="error" gutterBottom>
              Authentication Failed
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {error}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2">
                Try signing in again or contact support if the problem persists.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default GoogleCallback;