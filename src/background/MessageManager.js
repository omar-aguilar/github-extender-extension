class MessageManager {
  constructor() {
    this.subscribers = [];
    this._onMessageReceived = this._onMessageReceived.bind(this);
  }

  subscribe(callback) {
    const alreadySubscribed = this.subscribers.some(subscriber => subscriber === callback);
    if (!alreadySubscribed) {
      this.subscribers.push(callback);
    }
  }

  _onMessageReceived(tab, message) {
    if (chrome.runtime.lastError) {
      return;
    }
    this.subscribers.forEach(callback => callback(tab, message));
  }

  send(tab, message) {
    const onMessageReceived = this._onMessageReceived.bind(this, tab);
    chrome.tabs.sendMessage(tab.id, message, onMessageReceived);
  }
}

export default MessageManager;
