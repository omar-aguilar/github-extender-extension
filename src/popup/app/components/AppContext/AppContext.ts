import { createContext } from 'react';

export type AppContextProps = {
  globalConfig: BGPluginManager.GlobalConfig;
  pluginConfig: BGPluginManager.PluginConfig;
  setGlobalConfig: (config: BGPluginManager.GlobalConfig) => void;
  setPluginConfig: (config: BGPluginManager.PluginConfig) => void;
};

const AppContext = createContext<AppContextProps>({
  globalConfig: {},
  pluginConfig: {},
  setGlobalConfig: () => {},
  setPluginConfig: () => {},
});

export default AppContext;
