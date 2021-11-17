import { FunctionComponent } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { routes } from '../../../config/routes';
import MenuContainer from '../MenuContainer';
import GlobalConfigContainer from '../GlobalConfigContainer';
import styles from './ContentContainer.scss';

type LocationState = {
  backgroundLocation?: Location;
};

const ContentContainer: FunctionComponent = () => {
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const { backgroundLocation } = state;
  const sectionClasses = styles.container;
  return (
    <section className={sectionClasses}>
      <Routes location={backgroundLocation || location}>
        <Route path="/">
          <Route index element={<div>Home</div>} />
          <Route path={routes.GLOBAL_CONFIG.path} element={<GlobalConfigContainer />} />
          <Route path={routes.PLUGIN_CONFIG.path} element={<div>Plugin Config</div>} />
          <Route path="*" element={<div>No Match</div>} />
        </Route>
      </Routes>
      <Routes>
        <Route path={routes.MENU.path} element={<MenuContainer />} />
      </Routes>
    </section>
  );
};

export default ContentContainer;
