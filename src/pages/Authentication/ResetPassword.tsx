import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { validateResetTokenAPI, resetPasswordAPI } from '../../api/Auth';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import Logo from '../../images/logo/RTV_Logo.png';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface ResetPasswordParams {
  uid: string;
  token: string;
}

const ResetPassword: React.FC = () => {
  const params = useParams();
  const { uid, token } = params as ResetPasswordParams;
  const navigate = useNavigate();
  
  // Add console logs for debugging
  console.log('ResetPassword component rendered');
  console.log('Params:', params);
  console.log('UID:', uid);
  console.log('Token:', token);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      console.log('Validating token...');
      try {
        if (!uid || !token) {
          console.error('Missing uid or token');
          setMessage({ type: 'error', text: 'Invalid reset link. Missing parameters.' });
          setIsValidating(false);
          return;
        }
        
        console.log('Calling validateResetTokenAPI with:', { uid, token });
        const response = await validateResetTokenAPI(uid, token);
        console.log('Token validation response:', response);
        
        if (response.valid) {
          setIsTokenValid(true);
        } else {
          setMessage({ type: 'error', text: response.error || 'Invalid or expired reset link' });
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setMessage({ type: 'error', text: 'An error occurred while validating the reset link' });
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const response = await resetPasswordAPI(uid, token, newPassword);
      setMessage({ 
        type: 'success', 
        text: 'Your password has been reset successfully. You can now sign in with your new password.' 
      });
      
      // Clear the form
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/signin');
      }, 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An error occurred while resetting your password. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 8
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <img src={Logo} alt="Logo" width={60} />
          <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 'bold' }}>
            Reset Password
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Enter your new password
          </Typography>
        </Box>

        <Card sx={{ width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {message && (
              <Alert 
                severity={message.type} 
                sx={{ mb: 3 }}
                onClose={() => setMessage(null)}
              >
                {message.text}
              </Alert>
            )}
            
            {isValidating ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : isTokenValid ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  required
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    py: 1.5,
                    backgroundColor: '#EA580C',
                    '&:hover': {
                      backgroundColor: '#C2410C',
                    },
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="body1" color="error" gutterBottom>
                  Invalid or expired reset link
                </Typography>
                <Button 
                  component={Link} 
                  to="/auth/forgot-password"
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  Request a new reset link
                </Button>
              </Box>
            )}
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link to="/auth/signin" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Back to Sign In
                </Typography>
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ResetPassword; 