import { FunctionComponent } from 'react';
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

type MenuContainerProps = {
  open: boolean;
  onClose: () => void;
};

const MenuContainer: FunctionComponent<MenuContainerProps> = ({ open, onClose }) => {
  const drawerClasses = {
    root: styles.root,
    paper: styles.paper,
  };

  return (
    <Drawer classes={drawerClasses} variant="persistent" anchor="left" open={open}>
      <MenuHeader>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </MenuHeader>
      <Divider />
      <List component="nav" subheader={<ListSubheader>Settings</ListSubheader>}>
        {['Global Config'].map((text) => (
          <ListItemButton key={text}>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
        {['Plugin Config'].map((text) => (
          <ListItemButton key={text}>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuContainer;
