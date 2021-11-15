import GithubPageManager from './GithubPageManager';
import Hook from '../utils/Hook';
import { getStorageNewChanges } from '../utils/storage';

function PluginManager(
  extensions: BGPluginManager.Extensions,
  plugins: BGPluginManager.Plugins
): BGPluginManager {
  const name = 'Background.PluginManager';
  const hooks = {
    page: Hook<BGPluginManager.PageArguments>(['tab', 'sendMessage']),
    globalConfigChange: Hook<BGPluginManager.GlobalConfigChangeArguments>(['globalConfigChanges']),
    pluginConfigChange: Hook<BGPluginManager.PluginConfigChangeArguments>(['pluginConfigChanges']),
  };

  function handleTab(tab: ChromeTabs.ValidTab, sendMessage: BrowserExtensions.SendMessageFn): void {
    const sendPluginMessage: BGPluginManager.SendPluginMessageFn = (source, event, data) => {
      sendMessage({ source, event, data });
    };
    hooks.page.call(tab, sendPluginMessage);
  }

  function handleGlobalConfigChange(changes: ChromeStorage.StorageChanges): void {
    const { globalConfig } = changes;
    if (!globalConfig) {
      return;
    }
    const newGlobalConfig = getStorageNewChanges(globalConfig) as BGPluginManager.GlobalConfig;
    hooks.globalConfigChange.call(newGlobalConfig);
  }

  function handlePluginConfigChange(changes: ChromeStorage.StorageChanges): void {
    const { pluginConfig } = changes;
    if (!pluginConfig) {
      return;
    }
    const newPluginConfig = getStorageNewChanges(pluginConfig);
    hooks.pluginConfigChange.call(newPluginConfig);
  }

  function handleStorageKeyUpdate(changes: ChromeStorage.StorageChanges): void {
    handleGlobalConfigChange(changes);
    handlePluginConfigChange(changes);
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
    extensions.tabs.hooks.tab.tap(name, handleTab);
    extensions.storage.hooks.keyUpdated.tap(name, handleStorageKeyUpdate);
  }

  init();

  return {
    hooks,
  };
}

export default PluginManager;
