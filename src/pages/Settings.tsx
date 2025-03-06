import { useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import userOne from "../images/user/user-01.png";
import { updatePasswordAPI } from "../api/Auth";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Settings = () => {
  const user_email = localStorage.getItem("email") || "";
  const user_name = localStorage.getItem("username") || "";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setPasswordError("");
    
    const formData = new FormData(event.target as HTMLFormElement);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      setIsSubmitting(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await updatePasswordAPI(currentPassword, newPassword);
      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully!' 
      });
      
      // Reset form
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update password. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Personal Information" />
              <CardContent>
                <form>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={user_email}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Username"
                    value={user_name}
                    disabled
                    margin="normal"
                  />
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button variant="contained" color="warning" type="submit">
                      Save
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader title="Update Password" />
              <CardContent>
                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}
                
                <form onSubmit={handlePasswordUpdate}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    required
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    margin="normal"
                    helperText="Password must be at least 8 characters long"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button 
                      variant="contained" 
                      color="warning" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Your Photo" />
              <CardContent>
                <Box display="flex" alignItems="center">
                  <img src={userOne} alt="User" style={{ borderRadius: '50%', width: '56px', height: '56px' }} />
                  <Box ml={2}>
                    <Button variant="outlined" color="error">Delete</Button>
                    <Button variant="outlined" color="success">Update</Button>
                  </Box>
                </Box>
                <Box mt={2}>
                  <Button variant="contained" component="label" color="warning">
                    Upload
                    <input type="file" hidden accept="image/*" />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      
      {/* Snackbar for success/error messages */}
      <Snackbar 
        open={message !== null} 
        autoHideDuration={6000} 
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseMessage} 
          severity={message?.type || 'info'} 
          sx={{ width: '100%' }}
        >
          {message?.text || ''}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Settings;
