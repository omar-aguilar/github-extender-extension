import { merge } from 'ramda';
import { HOOK_NAMES } from './hooks';
import { PLUGIN_NAME } from './constants';
import { HighlightPRTitleConfig, HighlightPRTitleConfigMessage } from './types';

function background(config?: HighlightPRTitleConfig): BGPluginManager.Plugin {
  const name = PLUGIN_NAME;

  const baseConfig: HighlightPRTitleConfig = {
    selector: '.Box-row.js-issue-row',
    styles: [
      ['background-color', 'rgba(255, 0, 0, 0.1)'],
      ['text-decoration', 'line-through'],
    ],
    repoConfig: [],
  };

  const currentConfig = merge(baseConfig, config || {});

  const getRepoPath = (githubPage: GithubPageManager.GithubPage) => {
    return `${githubPage.organization}/${githubPage.repository}`;
  };

  function handleConfig(
    githubPage: GithubPageManager.GithubPage,
    sendMessage: BGPluginManager.SendPluginMessageFn
  ) {
    const currentRepoPath = getRepoPath(githubPage);
    const repoConfig = currentConfig.repoConfig.find(
      (repoCfg) => repoCfg.repoPath === currentRepoPath
    );

    if (!repoConfig) {
      return;
    }

    const configMsg: HighlightPRTitleConfigMessage = {
      selector: currentConfig.selector,
      styles: currentConfig.styles,
      ...repoConfig,
    };
    sendMessage(name, HOOK_NAMES.CONFIG, configMsg);
  }

  function register(registerHooks: BGPluginManager.RegisterHooks) {
    registerHooks.manager.github.pulls.tap(name, handleConfig);
  }

  return {
    register,
  };
}

export default background;
