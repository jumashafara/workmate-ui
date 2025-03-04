import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import LogoDark from "../../images/logo/RTV_Logo.png";
import Logo from "../../images/logo/RTV_Logo.png";
import { login } from "../../api/Auth";
import { toast } from "react-toastify";

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
  Paper,
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

const SignIn: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

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
      
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Sign In" />

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
