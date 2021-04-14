import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import GithubToken from './components/GithubToken';
import Footer from '../Footer';
import { setGithubToken } from '../../../store/actions/globalConfig';

import styles from './GlobalConfig.css';

class GlobalConfig extends Component {
  storageKey = 'globalConfig';

  componentDidMount() {
    const { updateGithubToken, getKey } = this.props;
    getKey(this.storageKey)
      .then(({ globalConfig }) => {
        const { githubToken } = globalConfig;
        updateGithubToken(githubToken);
      });
  }

  onGithubTokenUpdate = (event) => {
    const { updateGithubToken } = this.props;
    updateGithubToken(event.target.value);
  }

  onSaveChanges = () => {
    const { githubToken, setKey } = this.props;
    console.log('GlobalConfig.onSaveChanges', this.storageKey, githubToken);
    setKey(this.storageKey, { githubToken });
  }

  render() {
    const { githubToken } = this.props;
    return (
      <div className={styles.globalConfigContainer}>
        <GithubToken githubToken={githubToken} onGithubTokenUpdate={this.onGithubTokenUpdate} />
        <Footer>
          <Button variant="contained" color="primary" size="medium" className={styles.button} onClick={this.onSaveChanges}>
            Save Changes
          </Button>
        </Footer>
      </div>
    );
  }
}

GlobalConfig.propTypes = {
  githubToken: PropTypes.string.isRequired,
  updateGithubToken: PropTypes.func.isRequired,
  getKey: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired,
};

const mapStateToProps = ({ globalConfig }) => ({
  githubToken: globalConfig.githubToken,
});

const mapDispatchToProps = dispatch => ({
  updateGithubToken: token => dispatch(setGithubToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalConfig);
