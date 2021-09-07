import Hook from '../utils/Hook';

function PluginManager(
  githubPageManager: GithubPageManager,
  plugins: BGPluginManager.Plugins
): BGPluginManager {
  const name = 'Background.PluginManager';
  const hooks = {
    page: Hook<BGPluginManager.PageArguments>(['page', 'sendMessage']),
    /**
     * Add hooks for lifecycle
     * onInit: () => void; hooks.init ???
     * onLoaded: () => void; hooks.loaded ???
     * onConfigUpdate: () => void; > hook.config
     * onMessage: () => void; > hooks.page ✅
     */
  };

  function handlePage(
    githubPage: GithubPageManager.GithubPage,
    sendMessage: BrowserExtensions.SendMessageFn
  ): void {
    const sendPluginMessage = <T>(source: string, data: T): void => {
      sendMessage({ source, data });
    };

    hooks.page.call(githubPage, sendPluginMessage);
  }

  function registerPlugins() {
    plugins.forEach((plugin) => {
      plugin.register(hooks);
    });
  }

  function init(): void {
    registerPlugins();
    githubPageManager.hooks.page.tap(name, handlePage);
  }

  init();

  return {
    hooks,
  };
}

export default PluginManager;
