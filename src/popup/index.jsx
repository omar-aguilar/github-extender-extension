import React from 'react';
import { render } from 'react-dom';
import StorageManager from 'shared/StorageManager';
import App from './App';

const storageManager = new StorageManager();
const getKey = storageManager.getKey.bind(storageManager);
const setKey = storageManager.setKey.bind(storageManager);

// TODO include message to background when Save Changes is clicked
render(
  <App getKey={getKey} setKey={setKey} />,
  document.getElementById('app'),
);
