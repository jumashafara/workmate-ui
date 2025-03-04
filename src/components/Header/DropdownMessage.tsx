import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserOne from '../../images/user/user-01.png';
import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  Tooltip,
  Typography,
  Avatar,
  useTheme
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const DropdownMessage = () => {
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
      <Tooltip title="Messages">
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
            <ChatIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="messages-menu"
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
            '& .MuiAvatar-root': {
              width: 50,
              height: 50,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Messages
          </Typography>
        </Box>
        <Divider />
        
        <List sx={{ p: 0 }}>
          <ListItem 
            button 
            component={Link} 
            to="/messages"
            sx={{ 
              py: 1.5, 
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <ListItemAvatar>
              <Avatar src={UserOne} alt="Mariya Desoja" />
            </ListItemAvatar>
            <ListItemText 
              primary={
                <Typography variant="body2" fontWeight="medium">
                  Mariya Desoja
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    I like your confidence 💪
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    2min ago
                  </Typography>
                </>
              }
            />
          </ListItem>
          
          <Divider component="li" />
          
          <ListItem 
            button 
            component={Link} 
            to="/messages"
            sx={{ 
              py: 1.5, 
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <ListItemAvatar>
              <Avatar src={UserOne} alt="Robert Jhon" />
            </ListItemAvatar>
            <ListItemText 
              primary={
                <Typography variant="body2" fontWeight="medium">
                  Robert Jhon
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    Can you share your offer?
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    10min ago
                  </Typography>
                </>
              }
            />
          </ListItem>
          
          <Divider component="li" />
          
          <ListItem 
            button 
            component={Link} 
            to="/messages"
            sx={{ 
              py: 1.5, 
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <ListItemAvatar>
              <Avatar src={UserOne} alt="Henry Dholi" />
            </ListItemAvatar>
            <ListItemText 
              primary={
                <Typography variant="body2" fontWeight="medium">
                  Henry Dholi
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    I cam across your profile and...
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    1day ago
                  </Typography>
                </>
              }
            />
          </ListItem>
          
          <Divider component="li" />
          
          <ListItem 
            button 
            component={Link} 
            to="/messages"
            sx={{ 
              py: 1.5, 
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <ListItemAvatar>
              <Avatar src={UserOne} alt="Cody Fisher" />
            </ListItemAvatar>
            <ListItemText 
              primary={
                <Typography variant="body2" fontWeight="medium">
                  Cody Fisher
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    I'm waiting for you response!
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    5days ago
                  </Typography>
                </>
              }
            />
          </ListItem>
        </List>
      </Menu>
    </Box>
  );
};

export default DropdownMessage;
