import '@webcomponents/webcomponentsjs';
import extensionExtender from '../ExtensionExtender';
import ChromeRuntime from '../utils/browser/ChromeRuntime';
import PluginManager from './PluginManager';

const { runtime } = chrome;
const chromeRuntime = ChromeRuntime(runtime);

const plugins = extensionExtender.contentScript();
PluginManager(chromeRuntime, plugins);

console.log('content script loaded');
