/* eslint-disable react/no-unused-state */
import { PureComponent, ReactNode } from 'react';
import ChromeStorage from '../../../../utils/browser/ChromeStorage';
import ExtensionStorageContext, { ExtensionStorageContextProps } from './ExtensionStorageContext';
import { storageKeys } from '../../../../utils/storage';

type ExtensionStorageProps = {
  children: ReactNode;
};
type ExtensionStorageState = ExtensionStorageContextProps;

const { storage, runtime } = chrome;

class ExtensionStorageProvider extends PureComponent<ExtensionStorageProps, ExtensionStorageState> {
  chromeStorage: ChromeStorage;

  constructor(props: never) {
    super(props);
    this.chromeStorage = ChromeStorage(storage, runtime);
    this.setGlobalConfig = this.setGlobalConfig.bind(this);
    this.setPluginConfig = this.setPluginConfig.bind(this);
    this.state = {
      globalConfig: {},
      pluginConfig: {},
      setGlobalConfig: this.setGlobalConfig,
      setPluginConfig: this.setPluginConfig,
    };
    this.loadConfig();
  }

  setGlobalConfig(globalConfig: BGPluginManager.GlobalConfig): void {
    this.chromeStorage.actions
      .setKey(storageKeys.GLOBAL_CONFIG, globalConfig)
      .then(() => this.setState({ globalConfig }))
      .catch(console.error);
  }

  setPluginConfig(pluginConfig: BGPluginManager.PluginConfig): void {
    this.chromeStorage.actions
      .setKey(storageKeys.PLUGIN_CONFIG, pluginConfig)
      .then(() => this.setState({ pluginConfig }))
      .catch(console.error);
  }

  loadConfig(): void {
    this.chromeStorage.actions
      .getKeys([storageKeys.GLOBAL_CONFIG, storageKeys.PLUGIN_CONFIG])
      .then((values) => {
        const globalConfig = values[storageKeys.GLOBAL_CONFIG] || {};
        const pluginConfig = values[storageKeys.PLUGIN_CONFIG] || {};
        this.setState({ globalConfig, pluginConfig });
      })
      .catch(console.error);
  }

  render(): ReactNode {
    const { children } = this.props;
    return (
      <ExtensionStorageContext.Provider value={this.state}>
        {children}
      </ExtensionStorageContext.Provider>
    );
  }
}

export default ExtensionStorageProvider;
