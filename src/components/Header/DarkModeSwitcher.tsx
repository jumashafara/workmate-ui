import useColorMode from '../../hooks/useColorMode';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();
  const theme = useTheme();

  return (
    <Tooltip title={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={() => {
          if (typeof setColorMode === 'function') {
            setColorMode(colorMode === 'light' ? 'dark' : 'light');
          }
        }}
        color="inherit"
        sx={{ 
          ml: 1,
          '&:hover': {
            color: theme.palette.mode === 'dark' ? 'primary.main' : 'warning.main',
          }
        }}
      >
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeSwitcher;
