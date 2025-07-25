import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import LogoDark from "../../images/logo/RTV_Logo.png";
import { login, getGoogleAuthUrl, googleAuthenticate } from "../../api/Auth";
import { toast } from "react-toastify";
import GoogleIcon from "@mui/icons-material/Google";

// MUI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Custom styled components
const OrangeButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ea580c",
  color: "white",
  "&:hover": {
    backgroundColor: "#c2410c",
  },
  padding: "12px 0",
  fontWeight: "bold",
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ffffff",
  color: "#757575",
  border: "1px solid #dddddd",
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
  padding: "12px 0",
  fontWeight: "bold",
  textTransform: "none"
}));

const SignIn: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Look for the code parameter in the URL (for Google OAuth callback)
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleGoogleCallback(code);
    }
  }, [location]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await login({ username, password });
      // Save the tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("fullname", data.user.full_name);
      localStorage.setItem("superuser", `${data.user.is_superuser}`);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("region", data.user.region);
      localStorage.setItem("district", data.user.district);
      
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleGoogleCallback = async (code: string) => {
    try {
      setGoogleLoading(true);
      const data = await googleAuthenticate(code);
      
      // Save the tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("fullname", data.user.full_name);
      localStorage.setItem("superuser", `${data.user.is_superuser}`);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("region", data.user.region);
      localStorage.setItem("district", data.user.district);
      toast.success("Google login successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      setGoogleLoading(false);
      toast.error(error.message);
      setErrorMessage("Google authentication failed: " + error.message);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const authUrl = await getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error: any) {
      setGoogleLoading(false);
      toast.error(error.message);
      setErrorMessage("Failed to initiate Google login: " + error.message);
    }
  };

  return (
    <>
      <Breadcrumb pageName="" />

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Card elevation={3} sx={{ overflow: "hidden" }}>
          <Grid container>
            {/* Left side with image - hidden on small screens */}
            <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 4,
                  bgcolor: "#fff7ed", // Light orange background
                  textAlign: "center",
                }}
              >
                <Link to="/">
                  <img src={LogoDark} alt="Logo" width={70} />
                </Link>
                <Typography variant="h6" sx={{ mt: 2, mb: 4, color: "#333" }}>
                  Welcome back to RTV Workmate
                </Typography>
                <Box sx={{ maxWidth: "80%", mx: "auto" }}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
                    alt="Register"
                    style={{ maxWidth: "100%", height: "auto", maxHeight: "300px" }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Right side with login form */}
            <Grid item xs={12} md={6}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Box sx={{ mb: 4, textAlign: "center" }}>
                  {/* Logo for mobile view */}
                  <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center", mb: 2 }}>
                    <img src={LogoDark} alt="Logo" width={60} />
                  </Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Enter your credentials to access your account
                  </Typography>
                </Box>

                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMessage}
                  </Alert>
                )}

                <form onSubmit={handleSignIn}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    required
                      type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
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
                      ),
                    }}
                  />

                  <Box sx={{ mt: 1, mb: 3, textAlign: "right" }}>
                    <Link to="/auth/forgot-password" style={{ color: "#ea580c", textDecoration: "none" }}>
                      Forgot Password?
                    </Link>
                  </Box>

                  <OrangeButton
                      type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ mt: 2, mb: 3 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                  </OrangeButton>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  <GoogleButton
                    fullWidth
                    variant="contained"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    sx={{ mb: 3 }}
                  >
                    {googleLoading ? <CircularProgress size={24} color="inherit" /> : "Sign in with Google"}
                  </GoogleButton>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{" "}
                      <Link to="/auth/signup" style={{ color: "#ea580c", fontWeight: "bold", textDecoration: "none" }}>
                      Sign Up
                    </Link>
                    </Typography>
                  </Box>
              </form>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
};

export default SignIn;
