import { FunctionComponent } from 'react';
import clsx from 'clsx';
import ExtensionStorageProvider from './components/ExtensionStorageProvider';
import NotificationProvider from './components/NotificationProvider';
import AppHeader from './components/AppHeader';
import RoutesContainer from './components/RoutesContainer';
import styles from './App.scss';

const App: FunctionComponent = () => {
  const containerClasses = clsx(styles.container);
  return (
    <ExtensionStorageProvider>
      <NotificationProvider>
        <main className={containerClasses}>
          <AppHeader />
          <RoutesContainer />
        </main>
      </NotificationProvider>
    </ExtensionStorageProvider>
  );
};

export default App;
