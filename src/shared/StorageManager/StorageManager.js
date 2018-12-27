class StorageManager {
  constructor() {
    this.storageArea = 'local';
    this.storage = chrome.storage[this.storageArea];
    this.subscribers = {};
    this._onKeyUpdated = this._onKeyUpdated.bind(this);
    chrome.storage.onChanged.addListener(this._onKeyUpdated);
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

  _onKeyUpdated(changes, areaName) {
    if (areaName === this.storageArea) {
      const changedKeys = Object.keys(changes);
      changedKeys.forEach((key) => {
        const subscribers = this.subscribers[key];
        if (subscribers) {
          const { newValue: value } = changes[key];
          subscribers.forEach(handler => handler.onKeyUpdated(value));
        }
      });
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
