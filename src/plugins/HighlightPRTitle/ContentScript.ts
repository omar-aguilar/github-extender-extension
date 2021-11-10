import hooks from './hooks';
import { PLUGIN_NAME } from './constants';

function HighlightPRTitle(): CSPluginManager.Plugin {
  const name = PLUGIN_NAME;

  function highlight(elem: HTMLElement, data: any): void {
    const { styles } = data;
    const { style } = elem;
    const title = elem.querySelector('a')?.innerText || '';

    const match = '^(?:\\[[A-Za-z0-9]+-[A-Za-z0-9]+\\])+\\s[A-Z]';
    const regex = RegExp(match);
    if (regex.test(title)) {
      return;
    }

    (Object.keys(styles) as Array<any>).forEach((key) => {
      style[key] = styles[key];
    });
  }

  function handleConfig(data: any): void {
    const selector = '.Box-row.js-issue-row';
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

export default HighlightPRTitle;
