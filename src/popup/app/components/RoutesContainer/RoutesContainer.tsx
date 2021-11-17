import { FunctionComponent } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { routes } from '../../../config/routes';
import ScreenContainer from '../ScreenContainer';
import GlobalConfigScreen from '../../screens/GlobalConfig';
import PluginConfigScreen from '../../screens/PluginConfig';
import HomeScreen from '../../screens/Home';
import NotFoundScreen from '../../screens/NotFound';
import MenuScreen from '../../screens/Menu';

type LocationState = {
  backgroundLocation?: Location;
};

const RoutesContainer: FunctionComponent = () => {
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const { backgroundLocation } = state;
  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path={routes.HOME.path} element={<ScreenContainer />}>
          <Route index element={<HomeScreen />} />
          <Route path={routes.GLOBAL_CONFIG.path} element={<GlobalConfigScreen />} />
          <Route path={routes.PLUGIN_CONFIG.path} element={<PluginConfigScreen />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Route>
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route path={routes.MENU.path} element={<MenuScreen />} />
        </Routes>
      )}
    </>
  );
};

export default RoutesContainer;
