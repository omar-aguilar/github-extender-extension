import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import AceEditor from 'react-ace';
import { isValidJSON } from './configValidator';

import styles from './RepoConfig.css';
import 'brace/mode/json'; // eslint-disable-line
import 'brace/theme/tomorrow'; // eslint-disable-line

class RepoConfig extends React.Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      configOpen: true,
      owner: value.owner || '',
      config: value.config || '',
      jsonError: '',
    };
    this.toggleConfig = this.toggleConfig.bind(this);
    this.onChangeConfig = this.onChangeConfig.bind(this);
    this.onChangeOwner = this.onChangeOwner.bind(this);
  }

  onChangeOwner(event) {
    const { onUpdateStore } = this.props;
    const { value } = event.target;
    this.setState({ owner: value });
    onUpdateStore({ owner: value });
  }

  onChangeConfig(value) {
    const { onUpdateStore } = this.props;
    const validation = value ? isValidJSON(value) : {};
    let errorMessage = '';
    if (validation.error) {
      errorMessage = validation.error.details[0].message;
    }
    this.setState({ config: value, jsonError: errorMessage });
    onUpdateStore({ config: value });
  }

  toggleConfig() {
    const { configOpen } = this.state;
    this.setState({ configOpen: !configOpen });
  }

  render() {
    const {
      configOpen,
      config,
      owner,
      jsonError,
    } = this.state;
    const { onDelete } = this.props;
    return (
      <div className={styles.repoConfigContainer}>
        <div className={styles.repoOwner}>
          <TextField type="text" label="Owner" fullWidth onChange={this.onChangeOwner} value={owner} />
        </div>
        <div>
          <button type="button" className={styles.labelContainer} onClick={this.toggleConfig}>
            <div className={styles.label}>Config</div>
            <div className={`${styles.arrow} ${configOpen ? styles.down : styles.up}`} />
          </button>
          { jsonError && (
            <div className={styles.labelError}>
              <span>{jsonError}</span>
            </div>
          )}
          {configOpen && (
            <AceEditor
              mode="json"
              theme="tomorrow"
              height="170px"
              width="100%"
              tabSize={2}
              showPrintMargin={false}
              onChange={this.onChangeConfig}
              value={config}
              editorProps={{ $blockScrolling: true }}
            />
          )}
        </div>
        <Tooltip title="Delete">
          <Fab
            color="secondary"
            size="small"
            aria-label="Delete"
            className={styles.iconError}
            onClick={onDelete}
          >
            <DeleteIcon />
          </Fab>
        </Tooltip>
      </div>
    );
  }
}

RepoConfig.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onUpdateStore: PropTypes.func.isRequired,
  value: PropTypes.shape({
    owner: PropTypes.string,
    config: PropTypes.string,
  }),
};

RepoConfig.defaultProps = {
  value: {
    owner: '',
    config: '',
  },
};

export default RepoConfig;
