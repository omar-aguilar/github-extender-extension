import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import RepoConfig from './components/RepoConfig';

import styles from './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabIdx: 0,
      repoConfigItems: [],
      initConfig: {
        repoConfig: [],
        globalConfig: {},
      },
      config: {
        repoConfig: [],
        globalConfig: {},
      },
    };
    this.onUpdateGlobalConfig = this.onUpdateGlobalConfig.bind(this);
    this.onUpdateRepoConfig = this.onUpdateRepoConfig.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onAddNewRepoConfig = this.onAddNewRepoConfig.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    const { getKey } = this.props;
    getKey('config')
      .then(({ config }) => {
        if (config) {
          const repoConfigItems = Array(config.repoConfig.length).fill(true);
          this.setState({ initConfig: config, repoConfigItems });
        }
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      repoConfigItems,
      initConfig,
      selectedTabIdx,
      config,
    } = this.state;
    return repoConfigItems !== nextState.repoConfigItems
      || initConfig !== nextState.initConfig
      || selectedTabIdx !== nextState.selectedTabIdx
      || config.globalConfig !== nextState.config.globalConfig;
  }

  onTabChange(event, value) {
    this.setState({ selectedTabIdx: value });
  }

  onAddNewRepoConfig() {
    const { repoConfigItems } = this.state;
    const newRepoConfigItems = [...repoConfigItems, true];
    this.setState({ repoConfigItems: newRepoConfigItems });
  }

  onDelete(idx) {
    const { repoConfigItems } = this.state;
    const newRepoConfigItems = [...repoConfigItems];
    newRepoConfigItems[idx] = null;
    this.setState({ repoConfigItems: newRepoConfigItems });
  }

  onUpdateGlobalConfig(partialState) {
    const { config } = this.state;
    const newStore = {
      ...config,
      globalConfig: {
        ...config.globalConfig,
        ...partialState,
      },
    };
    this.setState({ config: newStore });
  }

  onUpdateRepoConfig(idx, partialState) {
    const { config } = this.state;
    const repoConfig = [...config.repoConfig];
    repoConfig[idx] = {
      ...(repoConfig[idx] || {}),
      ...partialState,
    };
    const newStore = {
      ...config,
      repoConfig: [
        ...repoConfig,
      ],
    };
    this.setState({ config: newStore });
  }

  saveChanges() {
    const { setKey } = this.props;
    const { config, initConfig, repoConfigItems } = this.state;
    const { repoConfig } = config;
    const { repoConfig: initRepoConfig } = initConfig;
    const newRepoConfig = repoConfigItems.map((active, idx) => {
      if (!active) {
        return null;
      }
      const val = repoConfig[idx] || {};
      const initVal = initRepoConfig[idx] || {};
      return {
        ...initVal,
        ...val,
      };
    })
      .filter(value => value)
      .filter(value => value.owner && value.config);
    const newConfig = {
      globalConfig: {
        ...initConfig.globalConfig,
        ...config.globalConfig,
      },
      repoConfig: newRepoConfig,
    };
    setKey('config', newConfig);
  }

  render() {
    const {
      selectedTabIdx,
      repoConfigItems,
      initConfig,
      config,
    } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.menu}>
          <AppBar position="static">
            <Tabs value={selectedTabIdx} onChange={this.onTabChange} fullWidth>
              <Tab label="Repo Config" />
              <Tab label="Global Config" />
            </Tabs>
          </AppBar>
        </div>
        {selectedTabIdx === 0 && (
          <div className={styles.tabContent}>
            {repoConfigItems.map((value, idx) => {
              const onDelete = () => this.onDelete(idx);
              const onUpdateStore = partialState => this.onUpdateRepoConfig(idx, partialState);
              return value && (
                <RepoConfig
                  key={`repoConfig-${(idx + 0)}`}
                  onDelete={onDelete}
                  onUpdateStore={onUpdateStore}
                  value={config.repoConfig[idx] || initConfig.repoConfig[idx]}
                />
              );
            })}
          </div>
        )}
        {selectedTabIdx === 1 && (
          <div className={styles.tabContent}>
            <TextField
              type="text"
              label="Github Token"
              fullWidth
              value={config.globalConfig.githubToken || initConfig.globalConfig.githubToken}
              onChange={(event) => {
                this.onUpdateGlobalConfig({ githubToken: event.target.value });
              }}
            />
          </div>
        )}
        <div className={styles.footer}>
          { selectedTabIdx === 0 && (
            <Button variant="contained" color="primary" size="small" onClick={this.onAddNewRepoConfig}>
              Add One
              <AddIcon />
            </Button>
          )}
          <Button variant="contained" color="primary" size="small" onClick={this.saveChanges}>Save Changes</Button>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  setKey: PropTypes.func.isRequired,
  getKey: PropTypes.func.isRequired,
};

export default App;
