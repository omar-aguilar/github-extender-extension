import Hook from '../utils/Hook';

function PluginManager(
  chromeRuntime: ChromeRuntime,
  plugins: CSPluginManager.Plugins
): CSPluginManager {
  const name = 'ContentScripts.PluginManager';
  const hooks = {
    message: Hook<CSPluginManager.MessageArguments>(['source', 'data']),
  };

  function handleMessage(request: any) {
    const { source, data } = request;
    if (request.source === undefined || request.data === undefined) {
      return;
    }
    hooks.message.call(source, data);
  }

  function registerPlugins() {
    plugins.forEach((plugin) => {
      plugin.register(hooks);
    });
  }

  function init() {
    registerPlugins();
    chromeRuntime.hooks.message.tap(name, handleMessage);
  }

  init();
  return {
    hooks,
  };
}

export default PluginManager;
