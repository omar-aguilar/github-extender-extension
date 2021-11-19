import { HOOK_NAMES } from './hooks';
import { PLUGIN_NAME } from './constants';

function background(): BGPluginManager.Plugin {
  const name = PLUGIN_NAME;
  const maxDays = 7;

  function handleOpenTime(
    _: GithubPageManager.GithubPage,
    sendMessage: BGPluginManager.SendPluginMessageFn
  ) {
    sendMessage(name, HOOK_NAMES.OPEN_TIME, { maxDays });
  }

  function register(registerHooks: BGPluginManager.RegisterHooks) {
    registerHooks.manager.github.pulls.tap(name, handleOpenTime);
  }

  return {
    register,
  };
}

export default background;
