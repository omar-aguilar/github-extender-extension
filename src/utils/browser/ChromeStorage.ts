import Hook from '../Hook';

function ChromeStorage(storage: BrowserExtensions.Chrome.Storage): ChromeStorage {
  const hooks = {
    keyUpdated: Hook<ChromeStorage.StorageArguments>(['changes']),
  };

  function onKeyUpdated(changes: ChromeStorage.StorageChanges): void {
    hooks.keyUpdated.call(changes);
  }

  function init() {
    storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') {
        return;
      }
      onKeyUpdated(changes);
    });
  }

  init();

  return {
    hooks,
  };
}

export default ChromeStorage;
