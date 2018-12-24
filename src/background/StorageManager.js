class StorageManager {
  constructor() {
    this.storage = chrome.storage.local;
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
