import Hook from '../utils/Hook';

function GithubPageManager(tabs: ChromeTabs): GithubPageManager {
  const name = 'GithubPageManager';
  const hooks = {
    page: Hook<GithubPageManager.PageArguments>(['page', 'sendMessage', 'url']),
  };

  function getURL(stringUrl: string): URL {
    try {
      const url = new URL(stringUrl);
      return url;
    } catch (error) {
      return new URL('http://error');
    }
  }

  function getGithubPage(url: URL): GithubPageManager.GithubPage {
    const search = new URLSearchParams(url.search);
    const pathNameWithoutStartSlash = url.pathname.replace(/^\//, '');
    const [organization, repository, section, ...rest] = pathNameWithoutStartSlash.split('/');
    return {
      organization,
      repository,
      section,
      rest,
      search,
    };
  }

  function handleTab(tab: ChromeTabs.ValidTab, sendMessage: BrowserExtensions.SendMessageFn): void {
    const url = getURL(tab.url);
    if (url.hostname !== 'github.com') {
      return;
    }
    const githubPage = getGithubPage(url);
    hooks.page.call(githubPage, sendMessage, url);
  }

  function init(): void {
    tabs.hooks.tab.tap(name, handleTab);
  }

  init();

  return {
    hooks,
  };
}

export default GithubPageManager;
