import React, { useState } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const GithubToken = ({ githubToken, onGithubTokenUpdate }) => {
  const [showToken, setShowToken] = useState(false);

  const onToggleGithubTokenShow = () => {
    setShowToken(!showToken);
  };

  return (
    <TextField
      label="Github Token"
      type={showToken ? 'text' : 'password'}
      value={githubToken}
      fullWidth
      onChange={onGithubTokenUpdate}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="Toggle password visibility" onClick={onToggleGithubTokenShow}>
              {showToken ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

GithubToken.propTypes = {
  githubToken: PropTypes.string.isRequired,
  onGithubTokenUpdate: PropTypes.func.isRequired,
};

export default GithubToken;
