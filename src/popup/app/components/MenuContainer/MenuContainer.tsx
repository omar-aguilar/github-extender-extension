import { FunctionComponent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuHeader from './MenuHeader';
import { routes } from '../../../config/routes';
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

  return (
    <Drawer classes={drawerClasses} variant="persistent" anchor="left" open>
      <MenuHeader>
        <IconButton onClick={onBackArrowClick}>
          <ChevronLeftIcon />
        </IconButton>
      </MenuHeader>
      <Divider />
      <List component="nav">
        <ListItemButton component={Link} to={routes.HOME.path}>
          <ListItemText primary={routes.HOME.title} />
        </ListItemButton>
      </List>
      <Divider />
      <List component="nav" subheader={<ListSubheader>Settings</ListSubheader>}>
        <ListItemButton component={Link} to={routes.GLOBAL_CONFIG.path}>
          <ListItemText primary={routes.GLOBAL_CONFIG.title} />
        </ListItemButton>
        <ListItemButton component={Link} to={routes.PLUGIN_CONFIG.path}>
          <ListItemText primary={routes.PLUGIN_CONFIG.title} />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default MenuContainer;
