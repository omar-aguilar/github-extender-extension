import { PluginDefinition, RegisterFn, SendMessageFn } from '../../types';
import { UI_ID } from './constants';

export type Config = {
  selector?: string;
  ignoreWithLabels?: string[];
  blockLevel?: 'user' | 'group';
};

function ActivePRStatusBG(config?: Config): PluginDefinition {
  return (register: RegisterFn): void => {
    function contentScript(send: SendMessageFn<any>) {
      const defaultSelector = '.Box-row.js-issue-row';
      const selector = config?.selector || defaultSelector;
      console.log('send message to', UI_ID);
      send({ uiId: UI_ID, selector });
    }

    function background() {
      console.log('background');
    }

    function init() {
      register({ background, contentScript });
    }

    init();
  };
}

export default ActivePRStatusBG;
