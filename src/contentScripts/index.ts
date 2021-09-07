import HighlightPRTitle from '../plugins/HighlightPRTitle/ContentScript';
import ChromeRuntime from '../utils/browser/ChromeRuntime';
import PluginManager from './PluginManager';

const { runtime } = chrome;
const chromeRuntime = ChromeRuntime(runtime);

const plugins: CSPluginManager.Plugins = [HighlightPRTitle()];
PluginManager(chromeRuntime, plugins);
