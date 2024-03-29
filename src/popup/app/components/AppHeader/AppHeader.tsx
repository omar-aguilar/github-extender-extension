import { FunctionComponent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {
  routes,
  getRouteConfigByPath,
  LocationState,
  getStateFromLocation,
} from '../../../config/routes';
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
    const state: LocationState = {
      backgroundLocation: location,
    };
    navigate(routes.MENU.path, { state });
  };

  const state = getStateFromLocation(location);
  const currentContentLocation = state?.backgroundLocation || location;
  const routeConfig = getRouteConfigByPath(currentContentLocation.pathname);
  const { title } = document;
  const section = routeConfig?.title;

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
        <div className={styles.title}>
          <span className={styles['app-title']}>{title}</span>
          {section && <span className={styles['app-section']}>{section}</span>}
        </div>
      </Toolbar>
    </AppBar>
  );
};
export default AppHeader;
