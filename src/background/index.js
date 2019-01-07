import MessageManager from 'shared/MessageManager';
import StorageManager from 'shared/StorageManager';
import PageManager from './PageManager';

import {
  AddNumberOfChanges,
  GetActivePRStatus,
  HighlightRepoTitle,
} from './PageManager/handlers/pulls';

const storageManager = new StorageManager();
storageManager.getKey('config').then(({ config = {} }) => {
  // communication between background and content scripts
  const messageManager = new MessageManager();
  const pageManager = new PageManager(config, messageManager.send);
  const getActivePRStatus = new GetActivePRStatus(config);
  messageManager.subscribe(pageManager);
  storageManager.subscribe('config', pageManager);
  storageManager.subscribe('config', getActivePRStatus);
  pageManager.subscribe('page', 'pulls', getActivePRStatus);
  pageManager.subscribe('page', 'pulls', new AddNumberOfChanges());
  pageManager.subscribe('page', 'pulls', new HighlightRepoTitle());

  chrome.tabs.onCreated.addListener((tab) => {
    pageManager.onPageUpdateReceived(tab);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      pageManager.onPageUpdateReceived(tab);
    }
  });
});
