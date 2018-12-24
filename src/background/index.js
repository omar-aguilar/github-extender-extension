import PageManager from './PageManager';
import {
  AddNumberOfChanges,
  GetActivePRStatus,
  HighlightRepoTitle,
} from './handlers/pulls';

// communication between background and content scripts
const pageManager = new PageManager();
pageManager.subscribe('page', 'pulls', new AddNumberOfChanges());
pageManager.subscribe('page', 'pulls', new HighlightRepoTitle());
pageManager.subscribe('page', 'pulls', new GetActivePRStatus());

// chrome.tabs.onCreated.addListener((tab) => {
//   pageManager.onPageUpdateReceived(tab);
// });
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    pageManager.onPageUpdateReceived(tab);
  }
});
