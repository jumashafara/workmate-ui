import { useState } from "react";
import { Link } from "react-router-dom";
// import DropdownMessage from "./DropdownMessage";
// import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import LogoIcon from "../../images/logo/RTV_Logo.png";
import DarkModeSwitcher from "./DarkModeSwitcher";
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  InputBase, 
  useTheme,
  alpha,
  styled,
  InputAdornment,
  useMediaQuery
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={1}
      sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.paper,
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3, xl: 5.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={(e) => {
                  e.stopPropagation();
                  props.setSidebarOpen(!props.sidebarOpen);
                }}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              
              <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={LogoIcon} alt="Logo" width={25} />
              </Link>
            </>
          )}
        </Box>

        <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Type to search..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
          <DarkModeSwitcher />
          {/* <!-- Notification Menu Area --> */}
          {/* <DropdownNotification /> */}
          {/* <!-- Notification Menu Area --> */}

          {/* <!-- Chat Notification Area --> */}
          {/* <DropdownMessage /> */}
          {/* <!-- Chat Notification Area --> */}
          <DropdownUser />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
