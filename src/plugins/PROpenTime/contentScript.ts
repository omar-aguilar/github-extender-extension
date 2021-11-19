import hooks from './hooks';
import { registerWebComponent } from '../../utils/webcomponents';
import { PLUGIN_NAME } from './constants';

function contentScript(): CSPluginManager.Plugin {
  const name = PLUGIN_NAME;
  registerWebComponent('open-time-img', import('./webcomponents/OpenTimeImage'));

  function addMark(elem: HTMLElement, data: any): void {
    const markClassName = 'gee-open-time-container';
    const { maxDays } = data;

    if (elem.classList.contains(markClassName)) {
      return;
    }
    elem.classList.add(markClassName);

    const openTimeElem = elem.querySelector('relative-time');
    const datetime = openTimeElem?.getAttribute('datetime') || '';

    const openTimeImgContainer = document.createElement('open-time-img');
    openTimeImgContainer.setAttribute('max-days', maxDays);
    openTimeImgContainer.setAttribute('datetime', datetime);
    elem.insertBefore(openTimeImgContainer, elem.childNodes[4]);
  }

  function handleOpenTime(data: any): void {
    const selector = '.opened-by';
    document.querySelectorAll<HTMLElement>(selector).forEach((elem) => {
      addMark(elem, data);
    });
  }

  function register(_: CSPluginManager.Hooks, registerHooks: CSPluginManager.RegisterHooksFn) {
    registerHooks(name, hooks);
    hooks.openTime.tap(name, handleOpenTime);
  }

  return {
    register,
  };
}

export default contentScript;
