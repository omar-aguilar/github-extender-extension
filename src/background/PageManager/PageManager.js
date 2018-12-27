import { MessageManagerHandlerInterface } from 'shared/MessageManager';
import { getGithubUrlMeta } from './utils';

class PageManager extends MessageManagerHandlerInterface {
  constructor(config, send) {
    super();
    this.pageUpdateTopics = {};
    this.messageTopics = {};
    this.config = config.repoConfig || [];
    this.send = send;
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

  subscribe(type = 'page', topic, handler) {
    const topics = type === 'message' ? this.messageTopics : this.pageUpdateTopics;
    if (!topics[topic]) {
      topics[topic] = [];
    }
    topics[topic].push(handler);
  }

  /**
   * @override
   */
  onKeyUpdated(config) {
    this.config = config.repoConfig || [];
  }

  /**
   * @override
   */
  onMessage(tab, message) {
    const url = new URL(tab.url);
    if (url.hostname !== 'github.com') {
      return;
    }
    const urlMeta = getGithubUrlMeta(url.pathname);
    const config = this._getConfigFor(urlMeta.owner, urlMeta.repo);
    const topic = this.messageTopics[urlMeta.page];
    if (topic) {
      const send = this.send.bind(null, tab);
      topic.forEach(handler => handler.onMessage(send, tab, urlMeta, config, message));
    }
  }

  onPageUpdateReceived(tab) {
    const url = new URL(tab.url);
    if (url.hostname !== 'github.com') {
      return;
    }
    const urlMeta = getGithubUrlMeta(url.pathname);
    const config = this._getConfigFor(urlMeta.owner, urlMeta.repo);
    const topicName = urlMeta.page;
    const topic = this.pageUpdateTopics[topicName];
    if (topic) {
      const send = this.send.bind(null, tab);
      topic.forEach(handler => handler.onPageUpdate(send, tab, urlMeta, config));
    }
  }
}

export default PageManager;
