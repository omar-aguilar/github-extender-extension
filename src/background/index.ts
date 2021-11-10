import PROpenTime from '../plugins/PROpenTime/background';
import HighlightPRTitle from '../plugins/HighlightPRTitle/background';
import ChromeTabs from '../utils/browser/ChromeTabs';
import PluginManager from './PluginManager';

const { tabs } = chrome;
const chromeTabs = ChromeTabs(tabs);
const plugins: BGPluginManager.Plugins = [HighlightPRTitle(), PROpenTime()];
PluginManager(chromeTabs, plugins);

console.log('background loaded');
