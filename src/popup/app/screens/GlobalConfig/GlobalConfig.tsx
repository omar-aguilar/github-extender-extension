import { FunctionComponent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import GithubConfig from './components/GithubConfig';
import styles from './GlobalConfig.scss';
import useAppContext from '../../components/AppContext/useAppContext';
import useNotificationContext from '../../components/NotificationProvider/useNotificationContext';
import { addNotification } from '../../components/NotificationProvider/store';

const GlobalConfigContainer: FunctionComponent = () => {
  const { globalConfig, setGlobalConfig } = useAppContext();
  const [, dispatch] = useNotificationContext();
  const [storedGlobalConfig, setStoredGlobalConfig] =
    useState<BGPluginManager.GlobalConfig>(globalConfig);
  const { github = {} as BGPluginManager.GithubConfig } = storedGlobalConfig;

  useEffect(() => {
    setStoredGlobalConfig(globalConfig);
  }, [globalConfig]);

  const onGithubConfigUpdate = (githubConfigUpdate: BGPluginManager.GithubConfig) => {
    const newGlobalConfig = {
      ...storedGlobalConfig,
      github: {
        ...storedGlobalConfig?.github,
        ...githubConfigUpdate,
      },
    };
    setStoredGlobalConfig(newGlobalConfig);
  };

  const handleSave = () => {
    setGlobalConfig(storedGlobalConfig);
    dispatch(addNotification({ message: 'Saved Global Config', type: 'success' }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <GithubConfig config={github} onConfigUpdate={onGithubConfigUpdate} />
      </div>
      <div className={styles.footer}>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default GlobalConfigContainer;
