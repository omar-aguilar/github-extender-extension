import hooks from './hooks';
import { PLUGIN_NAME } from './constants';
import { HighlightPRTitleConfigMessage } from './types';

function contentScript(): CSPluginManager.Plugin {
  const name = PLUGIN_NAME;

  function highlight(elem: HTMLElement, data: HighlightPRTitleConfigMessage): void {
    const { styles, titleRegexp } = data;
    const { style } = elem;
    const title = elem.querySelector('a')?.innerText || '';
    const regex = RegExp(titleRegexp);
    if (regex.test(title)) {
      return;
    }

    styles.forEach((setPropertyParams) => {
      style.setProperty(...setPropertyParams);
    });
  }

  function handleConfig(data: HighlightPRTitleConfigMessage): void {
    const { selector } = data;
    document.querySelectorAll<HTMLElement>(selector).forEach((elem) => {
      highlight(elem, data);
    });
  }

  function register(_: CSPluginManager.Hooks, registerHooks: CSPluginManager.RegisterHooksFn) {
    registerHooks(name, hooks);
    hooks.config.tap(name, handleConfig);
  }

  return {
    register,
  };
}

export default contentScript;
