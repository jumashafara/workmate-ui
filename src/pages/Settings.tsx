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
} from "@mui/material";

const Settings = () => {
  const user_email = localStorage.getItem("email") || "";
  const user_name = localStorage.getItem("username") || "";

  const handlePasswordUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    const currentPassword = (event.target as any).currentPassword.value;
    const newPassword = (event.target as any).newPassword.value;
    const confirmPassword = (event.target as any).confirmPassword.value;

    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    // Call your API to update the password here
    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);
    updatePasswordAPI(currentPassword, newPassword).then((response) => {
      // Handle response
      if (response.status === 200) {
        console.log(response.message);
      } else {
        console.log(response.error);
      }
    });
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
                <form onSubmit={handlePasswordUpdate}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    name="newPassword"
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    required
                    margin="normal"
                  />
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button variant="contained" color="warning" type="submit">
                      Update Password
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
    </>
  );
};

export default Settings;
