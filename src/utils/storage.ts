import { equals, not, pick } from 'ramda';

export const storageKeys = {
  GLOBAL_CONFIG: 'globalConfig',
  PLUGIN_CONFIG: 'pluginConfig',
};

export function getStorageNewChanges(
  storageValue: chrome.storage.StorageChange
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  const oldValueChanges = storageValue.oldValue;
  const newValueChanges = storageValue.newValue;
  const pluginKeys = Object.keys(newValueChanges);
  const pluginKeysWithChanges = pluginKeys.filter((currentPlugin) => {
    const oldChanges = oldValueChanges[currentPlugin];
    const newChanges = newValueChanges[currentPlugin];
    return not(equals(oldChanges, newChanges));
  });
  const newStorageValue = pick(pluginKeysWithChanges, newValueChanges);
  return newStorageValue;
}
