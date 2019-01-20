import { MessageManagerHandlerInterface } from 'shared/MessageManager';
import { getGithubUrlMeta, getConfigFor } from './utils';

class PageManager extends MessageManagerHandlerInterface {
  constructor(config, send) {
    super();
    this.pageUpdateTopics = {};
    this.messageTopics = {};
    this.config = config.repoConfig || [];
    this.send = send;
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
    const config = getConfigFor(this.config, urlMeta.owner, urlMeta.repo);
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
    const config = getConfigFor(this.config, urlMeta.owner, urlMeta.repo);
    const topicName = urlMeta.page;
    const topic = this.pageUpdateTopics[topicName];
    if (topic) {
      const send = this.send.bind(null, tab);
      topic.forEach(handler => handler.onPageUpdate(send, tab, urlMeta, config));
    }
  }
}

export default PageManager;
