import ExtensionWrapper from 'shared/ExtensionWrapper';
import { getGithubUrlMeta } from './utils';

const tabs = ExtensionWrapper.getApi('tabs');

class PageManager {
  constructor() {
    this.subscriptions = [];
    this.listenEvents();
  }

  listenEvents() {
    tabs.onCreated.addListener((tab) => {
      this._onPageUpdateReceived(tab);
    });
    tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        this._onPageUpdateReceived(tab);
      }
    });
  }

  hasSubscription(handler) {
    return this.subscriptions.some(listenerHandler => listenerHandler === handler);
  }

  subscribe(handler) {
    if (!this.hasSubscription(handler)) {
      this.subscriptions.push(handler);
    }
  }

  _onEventReceived(tab, urlMeta) {
    const { page } = urlMeta;
    const send = tabs.sendMessage.bind(null, tab.id);
    this.subscriptions.forEach(handler => handler(page, send, urlMeta));
  }

  _onPageUpdateReceived = (tab) => {
    let url;
    try {
      url = new URL(tab.url);
    } catch (error) {
      console.log(`${tab.url} cannot cannot be parsed, ignoring`, error);
      return;
    }
    if (url.hostname !== 'github.com') {
      return;
    }
    const urlMeta = getGithubUrlMeta(url.pathname);
    this._onEventReceived(tab, urlMeta);
  }
}

export default PageManager;
