/* eslint-disable react/no-unused-state */
import { PureComponent, ReactNode } from 'react';
import clsx from 'clsx';
import ChromeStorage from '../../utils/browser/ChromeStorage';
import AppContext, { AppContextProps } from './components/AppContext';
import AppHeader from './components/AppHeader';
import RoutesContainer from './components/RoutesContainer';
import NotificationProvider from './components/NotificationProvider';
import { storageKeys } from '../../utils/storage';

import styles from './App.scss';

type AppState = AppContextProps;

const { storage, runtime } = chrome;

class App extends PureComponent<never, AppState> {
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
    const containerClasses = clsx(styles.container);
    return (
      <AppContext.Provider value={this.state}>
        <NotificationProvider>
          <main className={containerClasses}>
            <AppHeader />
            <RoutesContainer />
          </main>
        </NotificationProvider>
      </AppContext.Provider>
    );
  }
}

export default App;
