/* eslint-disable react/no-unused-state */
import { PureComponent, ReactNode } from 'react';
import clsx from 'clsx';
import ChromeStorage from '../../utils/browser/ChromeStorage';
import AppContext, { AppContextProps } from './components/AppContext';
import AppHeader from './components/AppHeader';
import RoutesContainer from './components/RoutesContainer';
import styles from './App.scss';

type AppState = AppContextProps;

const { storage, runtime } = chrome;

class App extends PureComponent<never, AppState> {
  chromeStorage: ChromeStorage;

  constructor(props: never) {
    super(props);
    this.setGlobalConfig = this.setGlobalConfig.bind(this);
    this.setPluginConfig = this.setPluginConfig.bind(this);
    this.chromeStorage = ChromeStorage(storage, runtime);
    this.loadConfig();
    this.state = {
      globalConfig: {},
      pluginConfig: {},
      setGlobalConfig: this.setGlobalConfig,
      setPluginConfig: this.setPluginConfig,
    };
  }

  setGlobalConfig(globalConfig: BGPluginManager.GlobalConfig): void {
    this.chromeStorage.actions.setKey('globalConfig', globalConfig);
  }

  setPluginConfig(pluginConfig: BGPluginManager.PluginConfig): void {
    this.chromeStorage.actions.setKey('pluginConfig', pluginConfig);
  }

  loadConfig(): void {
    this.chromeStorage.actions.getKeys(['globalConfig', 'pluginConfig']).then((values) => {
      const { globalConfig = {}, pluginConfig = {} } = values;
      this.setState({ globalConfig, pluginConfig });
    });
  }

  render(): ReactNode {
    const containerClasses = clsx(styles.container);
    return (
      <AppContext.Provider value={this.state}>
        <main className={containerClasses}>
          <AppHeader />
          <RoutesContainer />
        </main>
      </AppContext.Provider>
    );
  }
}

export default App;
