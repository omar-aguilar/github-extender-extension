import ActivePRStatus from '../plugins/ActivePRStatus';
import PluginManager from './PluginManager';
import { SendMessageFn } from '../types';

const { tabs } = chrome;

const plugins = [ActivePRStatus()];
const pluginManager = PluginManager(plugins);

function send<T>(tab: chrome.tabs.Tab): SendMessageFn<T> {
  return (data: T): void => {
    if (!tab.id) {
      console.error('invalid tab send');
      return;
    }
    tabs.sendMessage(tab.id, data);
  };
}

function handlePage(tab: chrome.tabs.Tab): void {
  if (!tab.url?.endsWith('pulls')) {
    return;
  }

  const background = pluginManager.backgrounds[0];
  const { contentScript } = pluginManager.contentScripts[0];
  background();

  const sendFn = send<any>(tab);
  contentScript?.(sendFn);
}

function getURL(stringUrl?: string): URL | void {
  if (!stringUrl) {
    return;
  }

  try {
    const url = new URL(stringUrl);
    return url;
  } catch (error) {
    console.error(`${stringUrl} cannot cannot be parsed, ignoring`, error);
  }
}
function onPageUpdateReceived(tab: chrome.tabs.Tab) {
  const url = getURL(tab.url);
  if (!url || url.hostname !== 'github.com') {
    return;
  }
  handlePage(tab);
}

tabs.onCreated.addListener(onPageUpdateReceived);

tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') {
    return;
  }
  onPageUpdateReceived(tab);
});
