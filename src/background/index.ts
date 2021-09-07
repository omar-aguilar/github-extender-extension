import HighlightPRTitle from '../plugins/HighlightPRTitle';
import ChromeTabs from '../utils/browser/ChromeTabs';
import GithubPageManager from './GithubPageManager';
import PluginManager from './PluginManager';

const { tabs } = chrome;
const chromeTabs = ChromeTabs(tabs);
const githubPageManager = GithubPageManager(chromeTabs);

const plugins: BGPluginManager.Plugins = [HighlightPRTitle()];
PluginManager(githubPageManager, plugins);

console.log('background loaded');
