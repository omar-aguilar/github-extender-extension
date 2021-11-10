import GithubPageManager from './GithubPageManager';
import Hook from '../utils/Hook';

function PluginManager(tabs: ChromeTabs, plugins: BGPluginManager.Plugins): BGPluginManager {
  const name = 'Background.PluginManager';
  const hooks = {
    page: Hook<BGPluginManager.PageArguments>(['tab', 'sendMessage']),
    /**
     * Add hooks for lifecycle
     * onInit: () => void; hooks.init ???
     * onLoaded: () => void; hooks.loaded ???
     * onConfigUpdate: () => void; > hook.config
     * onMessage: () => void; > hooks.page ✅
     */
  };

  function handleTab(tab: ChromeTabs.ValidTab, sendMessage: BrowserExtensions.SendMessageFn): void {
    const sendPluginMessage: BGPluginManager.SendPluginMessageFn = (source, event, data) => {
      sendMessage({ source, event, data });
    };
    hooks.page.call(tab, sendPluginMessage);
  }

  function registerPlugins(registerHooks: BGPluginManager.RegisterHooks) {
    plugins.forEach((plugin) => {
      plugin.register(registerHooks);
    });
  }

  function init(): void {
    const githubPageManager = GithubPageManager(hooks);
    const registerHooks: BGPluginManager.RegisterHooks = {
      plugin: hooks,
      manager: {
        github: githubPageManager.hooks,
      },
    };
    registerPlugins(registerHooks);
    tabs.hooks.tab.tap(name, handleTab);
  }

  init();

  return {
    hooks,
  };
}

export default PluginManager;
