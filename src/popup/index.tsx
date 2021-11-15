import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';

import './index.scss';

import App from './app';

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('app')
);
