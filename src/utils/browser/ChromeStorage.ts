import Hook from '../Hook';

function ChromeStorage(
  storage: BrowserExtensions.Chrome.Storage,
  runtime: BrowserExtensions.Chrome.Runtime
): ChromeStorage {
  const hooks = {
    keyUpdated: Hook<ChromeStorage.StorageArguments>(['changes']),
  };
  const storageArea = 'local';

  function onKeyUpdated(changes: ChromeStorage.StorageChanges): void {
    hooks.keyUpdated.call(changes);
  }

  function init() {
    storage.onChanged.addListener((changes, area) => {
      if (area !== storageArea) {
        return;
      }
      onKeyUpdated(changes);
    });
  }

  function setKey<T>(key: string, value: T): Promise<void | chrome.runtime.LastError> {
    return new Promise((resolve, reject) => {
      storage[storageArea].set({ [key]: value }, () => {
        if (runtime.lastError) {
          reject(runtime.lastError);
          return;
        }
        resolve();
      });
    });
  }

  function getKeys(keys: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      storage[storageArea].get(keys, (value) => {
        if (runtime.lastError) {
          reject(runtime.lastError);
          return;
        }
        resolve(value);
      });
    });
  }

  init();

  return {
    hooks,
    actions: {
      setKey,
      getKeys,
    },
  };
}

export default ChromeStorage;
