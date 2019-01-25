import MessageManager from 'shared/MessageManager';
import StorageManager from 'shared/StorageManager';
import { postMessageToSlack } from 'shared/utils';
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
  chrome.runtime.onMessage.addListener((request) => {
    const { report } = request;
    if (report) {
      if (report.blockReport) {
        const {
          owner,
          repo,
          usersInReport,
          responseType,
        } = report.blockReport;
        blockReport.get(owner, repo, usersInReport, responseType)
          .then((result) => {
            storageManager.setKey('report', result);
          });
      }
    }
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

  // Periodic tasks
  const alarms = {
    PERIODIC_REPORT: 'periodicReport',
  };
  console.log('background started');
  // start delayInMinutes after set and run periodically every periodInMinutes
  chrome.alarms.create('periodicReport', { delayInMinutes: 1, periodInMinutes: 30 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    const { reportConfig } = config;
    const { owner, repo, usersInReport } = reportConfig;
    if (alarm.name === alarms.PERIODIC_REPORT) {
      console.log('updating report', new Date().toLocaleString());
      blockReport.get(owner, repo, usersInReport)
        .then(report => storageManager.setKey('report', report));
    }
  });
});
