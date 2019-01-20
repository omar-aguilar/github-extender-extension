import MessageManager from 'shared/MessageManager';
import StorageManager from 'shared/StorageManager';
import { BlockReport } from './Analytics';
import PageManager from './PageManager';

import {
  AddNumberOfChanges,
  GetActivePRStatus,
  HighlightRepoTitle,
} from './PageManager/handlers/pulls';

const storageManager = new StorageManager();
storageManager.getKey('config').then(({ config = {} }) => {
  // communication between background and content scripts
  // features
  const messageManager = new MessageManager();
  const pageManager = new PageManager(config, messageManager.send);
  const getActivePRStatus = new GetActivePRStatus(config);
  // reports
  const blockReport = new BlockReport(config, getActivePRStatus);

  messageManager.subscribe(pageManager);
  storageManager.subscribe('config', pageManager);
  storageManager.subscribe('config', getActivePRStatus);
  storageManager.subscribe('config', blockReport);
  pageManager.subscribe('page', 'pulls', getActivePRStatus);
  pageManager.subscribe('page', 'pulls', new AddNumberOfChanges());
  pageManager.subscribe('page', 'pulls', new HighlightRepoTitle());

  // communication between background and popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { report } = request;
    if (report) {
      if (report.blockReport) {
        const { owner, repo } = report.blockReport;
        blockReport.get(owner, repo)
          .then((result) => {
            console.log('block report', result);
            sendResponse(result);
          });
      }
    }
    return true;
  });

  // listen to pageUpdates
  chrome.tabs.onCreated.addListener((tab) => {
    pageManager.onPageUpdateReceived(tab);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      pageManager.onPageUpdateReceived(tab);
    }
  });
});
