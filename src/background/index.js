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
  messageManager.subscribe(pageManager);
  pageManager.subscribe('page', 'pulls', new AddNumberOfChanges());
  pageManager.subscribe('page', 'pulls', new HighlightRepoTitle());
  pageManager.subscribe('page', 'pulls', new GetActivePRStatus(config));

  // chrome.tabs.onCreated.addListener((tab) => {
  //   pageManager.onPageUpdateReceived(tab);
  // });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      pageManager.onPageUpdateReceived(tab);
    }
  });
});