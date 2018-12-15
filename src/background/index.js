const mainConfig = {
  foxbroadcasting: {
    'fng-cms': {
      titleRegEx: /^(?:\[[A-Za-z0-9]+-[A-Za-z0-9]+\])+\s[A-Z]|Release \d+\.\d+\.\d+/,
    },
    'fng-cms-settings': {
      titleRegEx: /^(?:\[[A-Za-z0-9]+-[A-Za-z0-9]+\])+\s[A-Z]|Release \d+\.\d+\.\d+/,
    },
  },
};

const getConfigFor = (owner, repo) => {
  if (mainConfig[owner] && mainConfig[owner][repo]) {
    return mainConfig[owner][repo];
  }
  return {};
};

const getGithubRepoMeta = (url) => {
  const [, owner, repo, page, ...section] = url.split('/');
  return {
    owner,
    repo,
    page,
    section,
  };
};

const messageResponse = response => console.log('response', response);

const github = (tab) => {
  console.log(tab);
  const url = new URL(tab.url);
  if (url.hostname === 'github.com') {
    const { owner, repo, page } = getGithubRepoMeta(url.pathname);
    if (page === 'pulls') {
      // Pull Requests List
      const config = getConfigFor(owner, repo);
      const { titleRegEx } = config;
      if (titleRegEx) {
        const message = {
          pr: {
            refresh: {
              titleRegEx: titleRegEx.toString().replace(/^\/|\/$/g, ''),
            },
          },
        };
        chrome.tabs.sendMessage(tab.id, message, messageResponse);
      }
    }
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    github(tab);
  }
});
