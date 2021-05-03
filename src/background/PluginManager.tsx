import {
  BackgroundFn,
  ContentScriptBGFn,
  ContentScriptOptions,
  PluginDefinition,
  RegisterFn,
} from '../types';

type ContentScripts = {
  contentScript?: ContentScriptBGFn;
  contentScriptOptions?: ContentScriptOptions;
};

type PluginManagerDefinition = {
  backgrounds: BackgroundFn[];
  contentScripts: ContentScripts[];
};

function PluginManager(plugins: PluginDefinition[] = []): PluginManagerDefinition {
  const backgrounds: BackgroundFn[] = [];
  const contentScripts: ContentScripts[] = [];

  const register: RegisterFn = (options) => {
    const { background, contentScript, contentScriptOptions } = options;
    if (background) {
      backgrounds.push(background);
    }
    if (contentScript) {
      contentScripts.push({ contentScript, contentScriptOptions });
    }
  };

  plugins.forEach((plugin) => plugin(register));

  return { backgrounds, contentScripts };
}

export default PluginManager;
// https://www.npmjs.com/package/minimatch