import defaultConfig from './extension.config';

function ExtensionExtender(config: ExtensionExtender.Configuration): ExtensionExtender {
  const { plugins } = config;

  function background(): BGPluginManager.Plugin[] {
    return plugins.map((plugin) => plugin.background());
  }

  function contentScript(): CSPluginManager.Plugin[] {
    return plugins.map((plugin) => plugin.contentScript());
  }

  return {
    background,
    contentScript,
  };
}

const extensionExtender = ExtensionExtender(defaultConfig);

export default extensionExtender;
