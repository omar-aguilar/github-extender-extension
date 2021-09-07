import Hook from '../Hook';

function ChromeRuntime(runtime: BrowserExtensions.Chrome.Runtime): ChromeRuntime {
  const hooks = {
    message: Hook<ChromeRuntime.MessageArguments>(['request']),
  };

  function onMessageReceived(request: any): void {
    hooks.message.call(request);
  }

  function init() {
    runtime.onMessage.addListener((request /* , sender, sendResponse */) => {
      onMessageReceived(request);
    });
  }

  init();

  return {
    hooks,
  };
}

export default ChromeRuntime;
