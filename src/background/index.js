const github = (tab) => {
  // Pull requests
  if (/https:\/\/(?:www.)?github.*pull/.test(tab.url)) {
    chrome.tabs.executeScript(tab.id, {
      file: '/pullScreen.js',
    });
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    github(tab);
  }
});
