import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import Home from './components/Home';
import RepositoryConfig from './components/RepositoryConfig';
import GlobalConfig from './components/GlobalConfig';

import styles from './App.css';

class App extends Component {
  state = { tabIndex: 0 };

  onTabChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  }

  render() {
    const { tabIndex } = this.state;
    const { getKey, setKey } = this.props;
    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tabIndex}
            onChange={this.onTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Home" />
            <Tab label="Repository Config" />
            <Tab label="Global Config" />
          </Tabs>
        </AppBar>
        <div className={styles.tabContent}>
          {tabIndex === 0 && (<Home />)}
          {tabIndex === 1 && (<RepositoryConfig getKey={getKey} setKey={setKey} />)}
          {tabIndex === 2 && (<GlobalConfig getKey={getKey} setKey={setKey} />)}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  getKey: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired,
};

export default App;
