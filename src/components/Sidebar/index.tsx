import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/RTV_Logo.png';
import useColorMode from '../../hooks/useColorMode';
import React from 'react';
// MUI imports
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  IconButton, 
  Typography, 
  Collapse, 
  styled, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#1C2434',
    color: '#DEE4EE',
    borderRight: 'none',
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  backgroundColor: '#1C2434',
  color: '#FFFFFF',
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: '#DEE4EE',
  width: '100%',
  '&.active': {
    '& .MuiListItemButton-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: '#FFFFFF',
    },
  },
}));

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [colorMode, setColorMode] = useColorMode();

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <Box component="aside" ref={sidebar}>
      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onClick={(e) => isMobile && e.stopPropagation()}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <img src={Logo} alt="Logo" width={32} height={32} />
            <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold', color: '#FFFFFF' }}>
              Workmate
            </Typography>
          </Box>
          <IconButton onClick={() => setSidebarOpen(false)} ref={trigger} sx={{ color: '#FFFFFF' }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        <Box sx={{ overflow: 'auto', height: '100%' }}>
          <List component="nav" sx={{ px: 1 }}>
            {/* Dashboard */}
            <SidebarLinkGroup
              activeCondition={
                pathname === '/' || pathname.includes('dashboard')
              }
            >
              {(handleClick, open) => {
                return (
                  <React.Fragment>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                        sx={{ 
                          borderRadius: 1,
                          mb: 0.5,
                          backgroundColor: (pathname === '/' || pathname.includes('dashboard')) ? 
                            'rgba(255, 255, 255, 0.08)' : 
                            'transparent',
                          color: '#DEE4EE',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.04)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: '#FFFFFF' }}>
                          <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <StyledNavLink 
                          to="/"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ListItemButton sx={{ 
                            pl: 4, 
                            borderRadius: 1,
                            color: '#DEE4EE',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.04)'
                            }
                          }}>
                            <ListItemText primary="Predictions Dashboard" />
                          </ListItemButton>
                        </StyledNavLink>
                        <StyledNavLink 
                          to="/standard-evaluations"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ListItemButton sx={{ 
                            pl: 4, 
                            borderRadius: 1,
                            color: '#DEE4EE',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.04)'
                            }
                          }}>
                            <ListItemText primary="Standard Evaluations" />
                          </ListItemButton>
                        </StyledNavLink>
                        <StyledNavLink to="/checkin-evaluations">
                          <ListItemButton sx={{ 
                            pl: 4, 
                            borderRadius: 1,
                            color: '#DEE4EE',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.04)'
                            }
                          }}>
                            <ListItemText primary="Check-in Evaluations" />
                          </ListItemButton>
                        </StyledNavLink>
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              }}
            </SidebarLinkGroup>

            {/* Reports */}
            <SidebarLinkGroup
              activeCondition={
                pathname === '/model-metrics' ||
                pathname === '/feature-importance' ||
                pathname === '/individual-predictions' ||
                pathname === '/standard-evaluations'
              }
            >
              {(handleClick, open) => {
                return (
                  <React.Fragment>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                        sx={{ 
                          borderRadius: 1,
                          mb: 0.5,
                          backgroundColor: (
                            pathname === '/model-metrics' ||
                            pathname === '/feature-importance' ||
                            pathname === '/individual-predictions' ||
                            pathname.includes('standard-evaluations')
                          ) ? 
                            'rgba(255, 255, 255, 0.08)' : 
                            'transparent',
                          color: '#DEE4EE',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.04)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: '#FFFFFF' }}>
                          <AssessmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Model Interpretability" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <StyledNavLink 
                          to="/model-metrics"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ListItemButton sx={{ 
                            pl: 4, 
                            borderRadius: 1,
                            color: '#DEE4EE',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.04)'
                            }
                          }}>
                            <ListItemText primary="Model Metrics" />
                          </ListItemButton>
                        </StyledNavLink>
                        
                        <StyledNavLink 
                          to="/feature-importance"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ListItemButton sx={{ 
                            pl: 4, 
                            borderRadius: 1,
                            color: '#DEE4EE',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.04)'
                            }
                          }}>
                            <ListItemText primary="Feature Importance" />
                          </ListItemButton>
                        </StyledNavLink>
                        <StyledNavLink to="/individual-predictions">
                          <ListItemButton sx={{ 
                            pl: 4, 
                            borderRadius: 1,
                            color: '#DEE4EE',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.04)'
                            }
                          }}>
                            <ListItemText primary="Individual Predictions" />
                          </ListItemButton>
                        </StyledNavLink>
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              }}
            </SidebarLinkGroup>

            {/* Chat */}
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/chat-bot"
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: pathname === '/chat-bot' ? 
                    'rgba(255, 255, 255, 0.08)' : 
                    'transparent',
                  color: '#DEE4EE',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: '#FFFFFF' }}>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary="Chat" />
              </ListItemButton>
            </ListItem>

            {/* Settings */}
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/settings"
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: pathname === '/settings' ? 
                    'rgba(255, 255, 255, 0.08)' : 
                    'transparent',
                  color: '#DEE4EE',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: '#FFFFFF' }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {/* Authentication */}
            <SidebarLinkGroup
              activeCondition={
                pathname === '/auth' || pathname.includes('auth')
              }
            >
              {(handleClick, open) => {
                return (
                  <React.Fragment>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                        sx={{ 
                          borderRadius: 1,
                          mb: 0.5,
                          backgroundColor: (
                            pathname === '/auth/signin' ||
                            pathname === '/auth/signup'
                          ) ? 
                            'rgba(255, 255, 255, 0.08)' : 
                            'transparent',
                          color: '#DEE4EE',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.04)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: '#FFFFFF' }}>
                          <LoginIcon />
                        </ListItemIcon>
                        <ListItemText primary="Authentication" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <StyledNavLink 
                          to="/auth/signin"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ListItemButton sx={{ 
                            pl: 4, 
                            borderRadius: 1,
                            color: '#DEE4EE',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.04)'
                            }
                          }}>
                            <ListItemText primary="Sign In" />
                          </ListItemButton>
                        </StyledNavLink>
                        <StyledNavLink 
                          to="/auth/signup"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ListItemButton sx={{ 
                            pl: 4, 
                            borderRadius: 1,
                            color: '#DEE4EE',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.04)'
                            }
                          }}>
                            <ListItemText primary="Sign Up" />
                          </ListItemButton>
                        </StyledNavLink>
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              }}
            </SidebarLinkGroup>
          </List>
        </Box>
      </StyledDrawer>
    </Box>
  );
};

export default Sidebar;
