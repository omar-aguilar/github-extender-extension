import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import './assets/css/index.css';

import { store } from './store';
import App from './App';
import withExtensionStorage from './App/components/HOC/withExtensionStorage';

const AppWithStorage = withExtensionStorage(App);

render(
  <Provider store={store}>
    <AppWithStorage />
  </Provider>,
  document.getElementById('app'),
);
