import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import styles from './NewOwner.css';

const NewOwner = (props) => {
  const {
    title,
    open,
    onCreate,
    onClose,
  } = props;

  const [owner, setOwner] = useState('');

  const handleOwnerChange = (event) => {
    setOwner(event.target.value);
  };

  const handleOnClose = () => {
    setOwner('');
    onClose();
  };

  const handleOnCreate = () => {
    onCreate(owner);
    handleOnClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <TextField
          label="New Owner"
          className={styles.newOwner}
          onChange={handleOwnerChange}
          value={owner}
          autoFocus
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose} color="primary">
            Cancel
        </Button>
        <Button onClick={handleOnCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NewOwner.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NewOwner;
