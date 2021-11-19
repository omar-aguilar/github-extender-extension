import { createContext } from 'react';

export type ExtensionStorageContextProps = {
  globalConfig: BGPluginManager.GlobalConfig;
  pluginConfig: BGPluginManager.PluginConfig;
  setGlobalConfig: (config: BGPluginManager.GlobalConfig) => void;
  setPluginConfig: (config: BGPluginManager.PluginConfig) => void;
};

const ExtensionStorageContext = createContext<ExtensionStorageContextProps>({
  globalConfig: {},
  pluginConfig: {},
  setGlobalConfig: () => {},
  setPluginConfig: () => {},
});

export default ExtensionStorageContext;
