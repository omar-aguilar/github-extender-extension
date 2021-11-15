import ChromeStorage from '../utils/browser/ChromeStorage';
import ChromeTabs from '../utils/browser/ChromeTabs';
import PROpenTime from '../plugins/PROpenTime/background';
import HighlightPRTitle from '../plugins/HighlightPRTitle/background';
import PluginManager from './PluginManager';

const { tabs, storage } = chrome;
const chromeTabs = ChromeTabs(tabs);
const chromeStorage = ChromeStorage(storage);
const extensions: BGPluginManager.Extensions = {
  tabs: chromeTabs,
  storage: chromeStorage,
};
const plugins: BGPluginManager.Plugins = [HighlightPRTitle(), PROpenTime()];
PluginManager(extensions, plugins);

console.log('background loaded');
