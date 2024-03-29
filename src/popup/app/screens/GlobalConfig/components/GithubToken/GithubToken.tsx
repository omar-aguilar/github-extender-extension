import { FunctionComponent, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type GithubTokenProps = {
  token?: string;
  onChange?: (token: string) => void;
};

const GithubToken: FunctionComponent<GithubTokenProps> = ({ token = '', onChange }) => {
  const [showToken, setShowToken] = useState(false);

  const onGithubTokenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newToken = event.target.value;
    onChange?.(newToken);
  };

  const onToggleGithubTokenShow = () => {
    setShowToken(!showToken);
  };

  return (
    <TextField
      label="Github Token"
      value={token}
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
