class StorageManager {
  constructor() {
    this.storage = chrome.storage.local;
    this.subscribers = {};
  }

  subscribe(key, handler) {
    if (!this.subscribers[key]) {
      this.subscribers[key] = [];
    }
    const subscribers = this.subscribers[key];
    const alreadySubscribed = subscribers.some(subscriber => subscriber === handler);
    if (!alreadySubscribed) {
      subscribers.push(handler);
    }
  }

  setKey(key, value) {
    return new Promise((resolve, reject) => {
      this.storage.set({
        [key]: value,
      }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        const subscribers = this.subscribers[key] || [];
        subscribers.forEach(handler => handler.onKeyUpdated(value));
        resolve(true);
      });
    });
  }

  getKey(key) {
    return new Promise((resolve, reject) => {
      this.storage.get(key, (value) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(value);
      });
    });
  }
}

export default StorageManager;
