function HighlightPRTitle(): CSPluginManager.Plugin {
  const name = 'HighlightPRTitle';

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

  function handleMessage(source: string, data: any): void {
    if (source !== name) {
      return;
    }

    const selector = '.Box-row.js-issue-row';
    document.querySelectorAll<HTMLElement>(selector).forEach((elem) => {
      highlight(elem, data);
    });
  }

  function register(hooks: CSPluginManager.Hooks) {
    hooks.message.tap(name, handleMessage);
  }

  return {
    register,
  };
}

export default HighlightPRTitle;
