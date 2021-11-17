import { FunctionComponent, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const GithubToken: FunctionComponent = () => {
  const [githubToken, setGithubToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const onGithubTokenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newToken = event.target.value;
    setGithubToken(newToken);
  };
  const onToggleGithubTokenShow = () => {
    setShowToken(!showToken);
  };
  return (
    <TextField
      label="Github Token"
      value={githubToken}
      variant="standard"
      type={showToken ? 'text' : 'password'}
      onChange={onGithubTokenChange}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" onClick={onToggleGithubTokenShow}>
              {showToken ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default GithubToken;
