import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

import JSONEditor from '../JSONEditor';

import styles from './Configuration.css';

class Configuration extends PureComponent {
  onRepoEdit = (repoConfig) => {
    const { owner, onRepoEdit } = this.props;
    onRepoEdit(owner, repoConfig);
  }

  render() {
    const { owner, repoConfig, onOwnerDelete } = this.props;
    return (
      <div key={owner} className={styles.repoConfig}>
        <TextField
          label="Owner"
          className={styles.repoOwner}
          defaultValue={owner}
          InputProps={{
            readOnly: true,
          }}
        />
        <JSONEditor value={repoConfig} onRepoEdit={this.onRepoEdit} />
        <Tooltip title="Delete">
          <Fab
            color="secondary"
            size="small"
            aria-label="Delete"
            className={styles.iconDelete}
            onClick={() => onOwnerDelete(owner)}
          >
            <DeleteIcon />
          </Fab>
        </Tooltip>
      </div>
    );
  }
}

Configuration.propTypes = {
  owner: PropTypes.string.isRequired,
  repoConfig: PropTypes.string.isRequired,
  onOwnerDelete: PropTypes.func.isRequired,
  onRepoEdit: PropTypes.func.isRequired,
};

export default Configuration;
