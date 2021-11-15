import '@webcomponents/webcomponentsjs';
import PROpenTime from '../plugins/PROpenTime/contentScript';
import HighlightPRTitle from '../plugins/HighlightPRTitle/contentScript';
import ChromeRuntime from '../utils/browser/ChromeRuntime';
import PluginManager from './PluginManager';

const { runtime } = chrome;
const chromeRuntime = ChromeRuntime(runtime);

const plugins: CSPluginManager.Plugins = [HighlightPRTitle(), PROpenTime()];
PluginManager(chromeRuntime, plugins);

console.log('content script loaded');
