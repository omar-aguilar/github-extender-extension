import ChromeStorage from '../utils/browser/ChromeStorage';
import ChromeTabs from '../utils/browser/ChromeTabs';
import extensionExtender from '../ExtensionExtender';
import PluginManager from './PluginManager';

const { tabs, storage, runtime } = chrome;
const chromeTabs = ChromeTabs(tabs);
const chromeStorage = ChromeStorage(storage, runtime);
const extensions: BGPluginManager.Extensions = {
  tabs: chromeTabs,
  storage: chromeStorage,
};
const plugins: BGPluginManager.Plugins = extensionExtender.background();
PluginManager(extensions, plugins);

console.log('background loaded');
