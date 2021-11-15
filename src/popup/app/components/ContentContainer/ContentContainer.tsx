import { FunctionComponent } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MenuContainer from '../MenuContainer';

type LocationState = {
  backgroundLocation?: Location;
};

const ContentContainer: FunctionComponent = () => {
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const { backgroundLocation } = state;
  return (
    <section>
      <Routes location={backgroundLocation || location}>
        <Route path="/">
          <Route index element={<div>Home</div>} />
          <Route path="global-config" element={<div>Global Config</div>} />
          <Route path="plugin-config" element={<div>Plugin Config</div>} />
          <Route path="*" element={<div>No Match</div>} />
        </Route>
      </Routes>
      <Routes>
        <Route path="/menu" element={<MenuContainer />} />
      </Routes>
    </section>
  );
};

export default ContentContainer;
