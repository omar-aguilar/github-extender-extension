import { FunctionComponent } from 'react';
import GithubToken from '../GithubToken';

type GithubConfigProps = {
  config?: BGPluginManager.GithubConfig;
  onConfigUpdate: (githubConfigUpdate: BGPluginManager.GithubConfig) => void;
};

const GithubConfig: FunctionComponent<GithubConfigProps> = ({ config, onConfigUpdate }) => {
  const onGithubTokenChange = (token: string) => {
    const newConfig = {
      ...config,
      token,
    };
    onConfigUpdate(newConfig);
  };

  return <GithubToken token={config?.token} onChange={onGithubTokenChange} />;
};

export default GithubConfig;
