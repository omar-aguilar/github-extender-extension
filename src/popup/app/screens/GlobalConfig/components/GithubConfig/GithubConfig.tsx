import { FunctionComponent } from 'react';
import GithubToken from '../GithubToken';

type GithubConfigProps = {
  config: BGPluginManager.GithubConfig;
  onConfigUpdate: (githubConfigUpdate: BGPluginManager.GithubConfig) => void;
};

const GithubConfig: FunctionComponent<GithubConfigProps> = ({ config, onConfigUpdate }) => {
  const onGithubConfigChange = (changes: Partial<BGPluginManager.GithubConfig>): void => {
    const newConfig: BGPluginManager.GithubConfig = {
      ...config,
      ...changes,
    };
    onConfigUpdate(newConfig);
  };

  const onGithubTokenChange = (token: string) => {
    onGithubConfigChange({ token });
  };

  return <GithubToken token={config?.token} onChange={onGithubTokenChange} />;
};

export default GithubConfig;
