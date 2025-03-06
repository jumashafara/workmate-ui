import { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import UserOne from "../../images/user/user-01.png";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const DropdownUser = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    handleClose();
    navigate("/auth/signin");
  };

  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  const getUserInfo = () => {
    return {
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("is_staff")? 'staff' : 'user',
      id: localStorage.getItem("id"),
    };
  };

  const userInfo = getUserInfo();
  const isLoggedIn = !!getAccessToken();

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'right', mr: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            {userInfo.username ? userInfo.username : "Unknown User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
              {userInfo.role ? userInfo.role : "Unknown Role"}
          </Typography>
        </Box>

        <Tooltip title="Account settings">
          <IconButton
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar 
              src={UserOne} 
              alt="User" 
              sx={{ 
                width: 40, 
                height: 40,
                border: theme.palette.mode === 'dark' ? '1px solid #2E3A47' : '1px solid #E2E8F0'
              }}
            />
          </IconButton>
        </Tooltip>
        
        <KeyboardArrowDownIcon 
          fontSize="small" 
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            color: 'text.secondary',
            ml: 0.5
          }} 
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            width: 220,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        
        <MenuItem component={Link} to="/settings">
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Account Settings" />
        </MenuItem>
        
        <Divider />
        
        {isLoggedIn ? (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </MenuItem>
        ) : (
          <MenuItem component={Link} to="/auth/signin">
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sign In" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default DropdownUser;
