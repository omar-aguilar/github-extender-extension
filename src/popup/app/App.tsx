import { FunctionComponent, useState } from 'react';
import clsx from 'clsx';
import AppHeader from './components/AppHeader';
import ContentContainer from './components/ContentContainer';
import MenuContainer from './components/MenuContainer';
import styles from './App.scss';

const App: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const containerClasses = clsx(styles.container, open && styles['open-menu']);

  const handleMenuOpen = () => {
    setOpen(true);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  return (
    <main className={containerClasses}>
      <AppHeader onMenuIconClick={handleMenuOpen} />
      <ContentContainer />
      <MenuContainer open={open} onClose={handleMenuClose} />
    </main>
  );
};

export default App;
