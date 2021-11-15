import { FunctionComponent } from 'react';
import { useLinkClickHandler, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuHeader from './MenuHeader';
import styles from './MenuContainer.scss';

const MenuContainer: FunctionComponent = () => {
  const navigate = useNavigate();
  const drawerClasses = {
    root: styles.root,
    paper: styles.paper,
  };

  const onBackArrowClick = (): void => {
    navigate(-1);
  };

  const goToGlobalConfig = (): void => {
    navigate('/global-config');
  };

  const goToPluginConfig = (): void => {
    navigate('/plugin-config');
  };

  const goToHome = (): void => {
    navigate('/');
  };

  return (
    <Drawer classes={drawerClasses} variant="persistent" anchor="left" open>
      <MenuHeader>
        <IconButton onClick={onBackArrowClick}>
          <ChevronLeftIcon />
        </IconButton>
      </MenuHeader>
      <Divider />
      <List component="nav">
        <ListItemButton onClick={goToHome}>
          <ListItemText primary="Home" />
        </ListItemButton>
      </List>
      <Divider />
      <List component="nav" subheader={<ListSubheader>Settings</ListSubheader>}>
        <ListItemButton onClick={goToGlobalConfig}>
          <ListItemText primary="Global Config" />
        </ListItemButton>
        <ListItemButton onClick={goToPluginConfig}>
          <ListItemText primary="Plugin Config" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default MenuContainer;
