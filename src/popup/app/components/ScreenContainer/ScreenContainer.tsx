import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './ScreenContainer.scss';

const ScreenContainer: FunctionComponent = () => {
  const sectionClasses = styles.container;
  return (
    <section className={sectionClasses}>
      <Outlet />
    </section>
  );
};

export default ScreenContainer;
