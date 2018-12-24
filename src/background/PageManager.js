import MessageManager from './MessageManager';
import StorageManager from './StorageManager';

class PageManager {
  constructor() {
    this.pageUpdateTopics = {};
    this.messageTopics = {};
    this.config = {};

    this._onMessageReceived = this._onMessageReceived.bind(this);
    this.messageManager = new MessageManager();
    this.messageManager.subscribe(this._onMessageReceived);

    this._updateConfig = this._updateConfig.bind(this);
    this.storageManager = new StorageManager();
    this.storageManager.getKey('config').then(this._updateConfig);
  }

  _updateConfig({ config = {} }) {
    this.config = config.repoConfig || {};
  }

  _getConfigFor(owner, repo) {
    const ownerConfig = this.config.find(({ owner: repoOwner }) => repoOwner === owner) || {};
    const textConfig = ownerConfig.config;
    try {
      const parsedConfig = JSON.parse(textConfig);
      const config = parsedConfig.find(repoConfig => repoConfig.repo === repo);
      return config || {};
    } catch (error) {
      return {};
    }
  }

  static getGithubUrlMeta(url) {
    const [, owner, repo, page, ...section] = url.split('/');
    return {
      owner,
      repo,
      page,
      section,
    };
  }

  subscribe(type = 'page', topic, handler) {
    const topics = type === 'message' ? this.messageTopics : this.pageUpdateTopics;
    if (!topics[topic]) {
      topics[topic] = [];
    }
    topics[topic].push(handler);
  }

  _onMessageReceived(tab, message) {
    const url = new URL(tab.url);
    if (url.hostname !== 'github.com') {
      return;
    }
    const urlMeta = this.constructor.getGithubUrlMeta(url.pathname);
    const config = this._getConfigFor(urlMeta.owner, urlMeta.repo);
    const topic = this.messageTopics[urlMeta.page];
    if (topic) {
      const send = this.messageManager.send.bind(this.messageManager, tab);
      topic.forEach(handler => handler.onMessage(send, tab, urlMeta, config, message));
    }
  }

  onPageUpdateReceived(tab) {
    const url = new URL(tab.url);
    if (url.hostname !== 'github.com') {
      return;
    }
    const urlMeta = this.constructor.getGithubUrlMeta(url.pathname);
    const config = this._getConfigFor(urlMeta.owner, urlMeta.repo);
    const topicName = urlMeta.page;
    const topic = this.pageUpdateTopics[topicName];
    if (topic) {
      const send = this.messageManager.send.bind(this.messageManager, tab);
      topic.forEach(handler => handler.onPageUpdate(send, tab, urlMeta, config));
    }
  }
}

export default PageManager;
