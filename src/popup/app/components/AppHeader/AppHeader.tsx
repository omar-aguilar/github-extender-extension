import { FunctionComponent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './AppHeader.scss';

const AppHeader: FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toolbarClasses = {
    root: styles.toolbar,
  };
  const iconButtonClasses = {
    root: styles['menu-icon'],
  };

  const onMenuIconClick = (): void => {
    navigate('/menu', {
      state: {
        backgroundLocation: location,
      },
    });
  };

  return (
    <AppBar position="static">
      <Toolbar classes={toolbarClasses}>
        <IconButton
          color="inherit"
          onClick={onMenuIconClick}
          edge="start"
          classes={iconButtonClasses}
        >
          <MenuIcon />
        </IconButton>
        <span>Github Extension Extender</span>
      </Toolbar>
    </AppBar>
  );
};
export default AppHeader;
