import React from 'react';
import { render } from 'react-dom';
import withStorageManager from './StorageManagerProvider';
import App from './App';

// TODO include message to background when Save Changes is clicked
const AppWithStorage = withStorageManager(App);
render(
  <AppWithStorage />,
  document.getElementById('app'),
);
