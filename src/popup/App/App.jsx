import React from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';
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
      configHash: '',
      config: {
        repoConfig: [],
        globalConfig: {},
        reportConfig: {},
      },
      report: '',
    };
    this.onUpdateGlobalConfig = this.onUpdateGlobalConfig.bind(this);
    this.onUpdateRepoConfig = this.onUpdateRepoConfig.bind(this);
    this.onUpdateReportConfig = this.onUpdateReportConfig.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onAddNewRepoConfig = this.onAddNewRepoConfig.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.getBlockReport = this.getBlockReport.bind(this);
  }

  componentDidMount() {
    const { getKey } = this.props;
    const { config: initState } = this.state;
    getKey('config')
      .then(({ config }) => {
        if (config) {
          const newStateConfig = {
            ...initState,
            ...config,
          };
          const repoConfigItems = Array(config.repoConfig.length).fill(true);
          const configHash = md5(JSON.stringify(config));
          this.setState({ configHash, config: newStateConfig, repoConfigItems });
        }
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      repoConfigItems,
      configHash,
      selectedTabIdx,
      config,
      report,
    } = this.state;
    return repoConfigItems !== nextState.repoConfigItems
      || configHash !== nextState.configHash
      || selectedTabIdx !== nextState.selectedTabIdx
      || config !== nextState.config
      || report !== nextState.report;
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

  onUpdateReportConfig(partialState) {
    const { config } = this.state;
    const newStore = {
      ...config,
      reportConfig: {
        ...config.reportConfig,
        ...partialState,
      },
    };
    this.setState({ config: newStore });
  }

  getBlockReport() {
    const { config: { reportConfig } } = this.state;
    const { repo, owner } = reportConfig;
    if (repo && owner) {
      const message = {
        report: {
          blockReport: {
            owner,
            repo,
          },
        },
      };
      chrome.runtime.sendMessage(message, (response) => {
        console.log('got from background', response);
        this.setState({ report: `${response}` });
      });
    }
  }

  saveChanges() {
    const { setKey } = this.props;
    const { config, repoConfigItems } = this.state;
    const { repoConfig } = config;
    const newRepoConfig = repoConfigItems.map((active, idx) => {
      if (!active) {
        return null;
      }
      return {
        ...(repoConfig[idx] || {}),
      };
    })
      .filter(value => value)
      .filter(value => value.owner && value.config);
    const newConfig = {
      globalConfig: {
        ...config.globalConfig,
      },
      repoConfig: newRepoConfig,
      reportConfig: {
        ...config.reportConfig,
      },
    };
    setKey('config', newConfig);
  }

  render() {
    const {
      selectedTabIdx,
      repoConfigItems,
      config,
      report,
    } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.menu}>
          <AppBar position="static">
            <Tabs value={selectedTabIdx} onChange={this.onTabChange} fullWidth>
              <Tab label="Report" />
              <Tab label="Repo Config" />
              <Tab label="Global Config" />
            </Tabs>
          </AppBar>
        </div>
        {selectedTabIdx === 0 && (
          <div className={styles.tabContent}>
            <div className={styles.reportFields}>
              <TextField
                type="text"
                label="Owner"
                value={config.reportConfig.owner || ''}
                onChange={(event) => {
                  this.onUpdateReportConfig({ owner: event.target.value });
                }}
              />
              <TextField
                type="text"
                label="Repo"
                value={config.reportConfig.repo || ''}
                onChange={(event) => {
                  this.onUpdateReportConfig({ repo: event.target.value });
                }}
              />
              <TextField
                type="text"
                label="Current User"
                value={config.reportConfig.user || ''}
                onChange={(event) => {
                  this.onUpdateReportConfig({ user: event.target.value });
                }}
              />
            </div>
            <div className={styles.reportView}>
              <div className={styles.reportTitle}>Block Report</div>
              <div>{report}</div>
            </div>
          </div>
        )}
        {selectedTabIdx === 1 && (
          <div className={styles.tabContent}>
            {repoConfigItems.map((value, idx) => {
              const onDelete = () => this.onDelete(idx);
              const onUpdateStore = partialState => this.onUpdateRepoConfig(idx, partialState);
              return value && (
                <RepoConfig
                  key={`repoConfig-${(idx + 0)}`}
                  onDelete={onDelete}
                  onUpdateStore={onUpdateStore}
                  value={config.repoConfig[idx]}
                />
              );
            })}
          </div>
        )}
        {selectedTabIdx === 2 && (
          <div className={styles.tabContent}>
            <TextField
              type="text"
              label="Github Token"
              fullWidth
              value={config.globalConfig.githubToken || ''}
              onChange={(event) => {
                this.onUpdateGlobalConfig({ githubToken: event.target.value });
              }}
            />
          </div>
        )}
        <div className={styles.footer}>
          { selectedTabIdx === 0 && (
            <Button variant="contained" color="primary" size="small" onClick={this.getBlockReport}>Get Report</Button>
          )}
          { selectedTabIdx === 1 && (
            <Button variant="contained" color="primary" size="small" onClick={this.onAddNewRepoConfig}>
              Add One
              <AddIcon className={styles.icon} />
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
