import Hook from '../utils/Hook';

function PluginManager(
  chromeRuntime: ChromeRuntime,
  plugins: CSPluginManager.Plugins
): CSPluginManager {
  const name = 'ContentScripts.PluginManager';
  const hooks = {
    message: Hook<CSPluginManager.MessageArguments>(['source', 'event', 'data']),
  };
  const registeredPluginHooks: CSPluginManager.RegisteredHooks = {};

  function callPluginHook(source: string, event: string, data: any) {
    const pluginHooks = registeredPluginHooks[source];
    pluginHooks[event]?.call(data, { source, event });
  }

  function handleMessage(request: any) {
    const { source, event, data } = request;
    if (source === undefined || data === undefined || event === undefined) {
      return;
    }
    callPluginHook(source, event, data);
    hooks.message.call(source, event, data);
  }

  function registerHooks(pluginName: string, pluginHooks: CSPluginManager.PluginHooks) {
    registeredPluginHooks[pluginName] = pluginHooks;
  }

  function registerPlugins() {
    plugins.forEach((plugin) => {
      plugin.register(hooks, registerHooks);
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
