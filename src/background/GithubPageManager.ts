import Hook from '../utils/Hook';

function GithubPageManager(pluginManagerHooks: BGPluginManager['hooks']): GithubPageManager {
  const name = 'GithubPageManager';
  const hooks = {
    page: Hook<GithubPageManager.PageArguments>(['page', 'sendMessage', 'url']),
    pulls: Hook<GithubPageManager.PullsArguments>(['page', 'sendMessage']),
    pull: Hook<GithubPageManager.PullArguments>(['prNumber', 'page', 'sendMessage']),
  };

  const sectionHandlers: GithubPageManager.SectionHandlerMap = {
    pulls: (githubPage, sendMessage) => {
      hooks.pulls.call(githubPage, sendMessage);
    },
    pull: (githubPage, sendMessage) => {
      const [prNumber] = githubPage.rest as [string];
      hooks.pull.call(prNumber, githubPage, sendMessage);
    },
    noHandler: () => {},
  };

  function getSectionHandler(section: GithubPageManager.SectionHandlers) {
    return sectionHandlers[section] || sectionHandlers.noHandler;
  }

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

  function handleSection(
    githubPage: GithubPageManager.GithubPage,
    sendMessage: BGPluginManager.SendPluginMessageFn
  ): void {
    const { section } = githubPage;
    const handler = getSectionHandler(section as GithubPageManager.SectionHandlers);
    handler(githubPage, sendMessage);
  }

  function handlePage(
    tab: ChromeTabs.ValidTab,
    sendMessage: BGPluginManager.SendPluginMessageFn
  ): void {
    const url = getURL(tab.url);
    if (url.hostname !== 'github.com') {
      return;
    }

    const githubPage = getGithubPage(url);
    hooks.page.call(githubPage, sendMessage, url);
    handleSection(githubPage, sendMessage);
  }

  function init(): void {
    pluginManagerHooks.page.tap(name, handlePage);
  }

  init();

  return {
    hooks,
  };
}

export default GithubPageManager;
