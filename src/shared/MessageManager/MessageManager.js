class MessageManager {
  constructor() {
    this.subscribers = [];
    this._onMessageReceived = this._onMessageReceived.bind(this);
    this.send = this.send.bind(this);
  }

  subscribe(handler) {
    const alreadySubscribed = this.subscribers.some(subscriber => subscriber === handler);
    if (!alreadySubscribed) {
      this.subscribers.push(handler);
    }
  }

  _onMessageReceived(tab, message) {
    if (chrome.runtime.lastError) {
      return;
    }
    this.subscribers.forEach(handler => handler.onMessage(tab, message));
  }

  send(tab, message) {
    const onMessageReceived = this._onMessageReceived.bind(this, tab);
    chrome.tabs.sendMessage(tab.id, message, onMessageReceived);
  }
}

export default MessageManager;
