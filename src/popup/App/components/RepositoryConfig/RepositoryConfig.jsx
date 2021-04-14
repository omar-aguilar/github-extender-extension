import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import Footer from '../Footer';
import NewOwner from './components/NewOwner';
import Configuration from './components/Configuration';
import {
  addRepositoryConfig,
  deleteRepositoryConfig,
  editRepositoryConfig,
  setRepositoryConfig,
} from '../../../store/actions/repositoryConfig';

import styles from './RepositoryConfig.css';

class RepositoryConfig extends Component {
  storageKey = 'repositoryConfig';

  state = {
    openDialog: false,
  };

  componentDidMount() {
    const { actions, getKey } = this.props;
    getKey(this.storageKey)
      .then(({ repositoryConfig: storedConfig }) => {
        const loadedConfig = {};
        storedConfig.forEach((itemConfig) => {
          const { owner, repoConfig } = itemConfig;
          const textRepoConfig = JSON.stringify(repoConfig, null, 2);
          loadedConfig[owner] = {
            owner,
            repoConfig: textRepoConfig,
          };
        });
        actions.setRepositoryConfig(loadedConfig);
      });
  }

  openNewOwnerDialog = () => {
    this.setState({ openDialog: true });
  }

  closeNewOwnerDialog = () => {
    this.setState({ openDialog: false });
  }

  onOwnerCreate = (owner) => {
    const { actions } = this.props;
    actions.addRepositoryConfig(owner);
  }

  onOwnerDelete = (owner) => {
    const { actions } = this.props;
    actions.deleteRepositoryConfig(owner);
  }

  onRepoEdit = (owner, repoConfig) => {
    const { actions } = this.props;
    actions.editRepositoryConfig(owner, repoConfig);
  }

  onSaveChanges = () => {
    const { config, setKey } = this.props;
    const newConfig = Object.keys(config).map((key) => {
      const configItem = config[key];
      const { owner, repoConfig } = configItem;
      let parsedRepoConfig;
      try {
        parsedRepoConfig = JSON.parse(repoConfig);
      } catch (error) {
        parsedRepoConfig = {};
      }
      return {
        owner,
        repoConfig: parsedRepoConfig,
      };
    });
    setKey(this.storageKey, newConfig);
  }

  render() {
    const { config } = this.props;
    const { openDialog } = this.state;
    return (
      <div className={styles.configContainer}>
        <div className={styles.content}>
          {Object.keys(config).map((configKey) => {
            const { owner, repoConfig } = config[configKey];
            return (
              <Configuration
                key={configKey}
                owner={owner}
                repoConfig={repoConfig}
                onOwnerDelete={this.onOwnerDelete}
                onRepoEdit={this.onRepoEdit}
              />
            );
          })}
        </div>
        <Footer className={styles.footer}>
          <Fragment>
            <Button variant="contained" color="primary" size="medium" className={styles.button} onClick={this.openNewOwnerDialog}>
              Add One
              <AddIcon className={styles.icon} />
            </Button>
            <Button variant="contained" color="primary" size="medium" className={styles.button} onClick={this.onSaveChanges}>
              Save Changes
            </Button>
          </Fragment>
        </Footer>
        <NewOwner title="New" open={openDialog} onCreate={this.onOwnerCreate} onClose={this.closeNewOwnerDialog} />
      </div>
    );
  }
}

RepositoryConfig.propTypes = {
  config: PropTypes.objectOf(
    PropTypes.shape({
      owner: PropTypes.string.isRequired,
      repoConfig: PropTypes.string,
    }),
  ).isRequired,
  actions: PropTypes.shape({
    addRepositoryConfig: PropTypes.func,
    deleteRepositoryConfig: PropTypes.func,
    editRepositoryConfig: PropTypes.func,
    setRepositoryConfig: PropTypes.func,
  }).isRequired,
  getKey: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired,
};

const mapStateToProps = ({ repositoryConfig }) => ({
  config: repositoryConfig.config,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    addRepositoryConfig,
    deleteRepositoryConfig,
    editRepositoryConfig,
    setRepositoryConfig,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryConfig);
