import { FunctionComponent } from 'react';
import clsx from 'clsx';
import AppHeader from './components/AppHeader';
import ContentContainer from './components/ContentContainer';
import styles from './App.scss';

const App: FunctionComponent = () => {
  const containerClasses = clsx(styles.container);

  return (
    <main className={containerClasses}>
      <AppHeader />
      <ContentContainer />
    </main>
  );
};

export default App;
