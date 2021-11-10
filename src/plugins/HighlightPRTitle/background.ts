import { HOOK_NAMES } from './hooks';
import { PLUGIN_NAME } from './constants';

function HighlightPRTitle(): BGPluginManager.Plugin {
  const name = PLUGIN_NAME;
  const styles = {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  };

  function handleConfig(
    _: GithubPageManager.GithubPage,
    sendMessage: BGPluginManager.SendPluginMessageFn
  ) {
    sendMessage(name, HOOK_NAMES.CONFIG, { styles });
  }

  function register(registerHooks: BGPluginManager.RegisterHooks) {
    registerHooks.manager.github.pulls.tap(name, handleConfig);
  }

  return {
    register,
  };
}

export default HighlightPRTitle;
