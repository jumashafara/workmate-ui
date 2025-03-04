import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const DropdownNotification = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifying, setNotifying] = useState(true);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotifying(false);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            width: 34,
            height: 34,
            border: `0.5px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey[300]}`,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
            '&:hover': {
              color: theme.palette.primary.main
            }
          }}
        >
          <Badge
            variant="dot"
            color="error"
            invisible={!notifying}
            sx={{
              '& .MuiBadge-badge': {
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.8)', opacity: 0.9 },
                  '50%': { transform: 'scale(1)', opacity: 0.8 },
                  '100%': { transform: 'scale(0.8)', opacity: 0.9 }
                }
              }
            }}
          >
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="notifications-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            width: 320,
            maxHeight: 360,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Notification
          </Typography>
        </Box>
        <Divider />
        
        <List sx={{ p: 0 }}>
          <ListItem 
            button 
            component={Link} 
            to="#"
            sx={{ 
              py: 2,
              px: 2.5,
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <ListItemText 
              primary={
                <Typography variant="body2">
                  <Typography component="span" fontWeight="medium">
                    Edit your information in a swipe
                  </Typography>{' '}
                  Sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim.
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  12 May, 2025
                </Typography>
              }
              disableTypography
            />
          </ListItem>
          
          <Divider component="li" />
          
          <ListItem 
            button 
            component={Link} 
            to="#"
            sx={{ 
              py: 2,
              px: 2.5,
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <ListItemText 
              primary={
                <Typography variant="body2">
                  <Typography component="span" fontWeight="medium">
                    It is a long established fact
                  </Typography>{' '}
                  that a reader will be distracted by the readable.
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  24 Feb, 2025
                </Typography>
              }
              disableTypography
            />
          </ListItem>
          
          <Divider component="li" />
          
          <ListItem 
            button 
            component={Link} 
            to="#"
            sx={{ 
              py: 2,
              px: 2.5,
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <ListItemText 
              primary={
                <Typography variant="body2">
                  <Typography component="span" fontWeight="medium">
                    There are many variations
                  </Typography>{' '}
                  of passages of Lorem Ipsum available, but the majority have
                  suffered
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  04 Jan, 2025
                </Typography>
              }
              disableTypography
            />
          </ListItem>
          
          <Divider component="li" />
          
          <ListItem 
            button 
            component={Link} 
            to="#"
            sx={{ 
              py: 2,
              px: 2.5,
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <ListItemText 
              primary={
                <Typography variant="body2">
                  <Typography component="span" fontWeight="medium">
                    There are many variations
                  </Typography>{' '}
                  of passages of Lorem Ipsum available, but the majority have
                  suffered
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  01 Dec, 2024
                </Typography>
              }
              disableTypography
            />
          </ListItem>
        </List>
      </Menu>
    </Box>
  );
};

export default DropdownNotification;
