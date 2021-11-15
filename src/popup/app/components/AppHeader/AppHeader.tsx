import { FunctionComponent } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './AppHeader.scss';

type AppHeaderProps = {
  onMenuIconClick: () => void;
};

const AppHeader: FunctionComponent<AppHeaderProps> = ({ onMenuIconClick }) => {
  const toolbarClasses = {
    root: styles.toolbar,
  };
  const iconButtonClasses = {
    root: styles['menu-icon'],
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
