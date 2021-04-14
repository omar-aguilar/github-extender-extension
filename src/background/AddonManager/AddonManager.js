import * as availableAddons from 'shared/Addons';

class AddonManager {
  constructor(repositoryConfig, globalConfig) {
    this.repositoryConfig = repositoryConfig || [];
    this.globalConfig = globalConfig || {};
    this.init();
  }

  _onRepositoryConfigUpdate = (repositoryConfig) => {
    this.repositoryConfig = repositoryConfig;
    // console.log('AddonManager._onRepositoryConfigUpdate', repositoryConfig);
    this.init();
  }

  _onGlobalConfigUpdate = (globalConfig) => {
    this.globalConfig = globalConfig;
    // console.log('AddonManager._onGlobalConfigUpdate', globalConfig);
    this.init();
  }

  _onEventReceived = (event, send, callerMeta) => {
    const localEventName = this.getEventName(callerMeta.repo, callerMeta.owner, event);
    const listeners = this.listeners[localEventName] || [];
    listeners.forEach((handler) => {
      const response = handler(callerMeta);
      if (response instanceof Promise) {
        response.then((data) => {
          const message = {
            [event]: data,
          };
          send(message);
        });
        return;
      }
      const message = {
        [event]: response,
      };
      send(message);
    });
  }

  getEventName(repo, owner, event) {
    return `${repo}/${owner}/${event}`;
  }

  hasEventListener(event, handler) {
    const listeners = this.listeners[event] || [];
    return listeners.some((listenerHandler) => listenerHandler === handler);
  }

  addEventListener(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    if (!this.hasEventListener(event, handler)) {
      this.listeners[event].push(handler);
    }
  }

  init() {
    this.listeners = {};
    this.repositoryConfig.forEach((config) => {
      if (!config) {
        return;
      }
      const { owner, repoConfig: repoConfigArray } = config || {};
      repoConfigArray.forEach((repoConfig) => {
        this.registerAddons(owner, repoConfig);
      });
    });
  }

  registerAddons(owner, repoConfig) {
    const { repo, addons } = repoConfig || {};
    if (!addons) {
      return;
    }
    addons.forEach((addonConfig) => {
      const {
        name,
        enabled,
        events,
        requiresGlobalConfig,
        config,
      } = addonConfig || {};
      const Addon = availableAddons[name];
      if (!Addon || !enabled || !events || !events.length) {
        return;
      }
      const addon = new Addon(config, requiresGlobalConfig ? this.globalConfig : null);
      events.forEach((event) => {
        const localEventName = this.getEventName(repo, owner, event);
        const exec = addon.exec.bind(addon);
        this.addEventListener(localEventName, exec);
      });
    });
  }
}

export default AddonManager;

// [
//   {
//     "addons": [
//       {
//         "config": {
//           "ignoreWithLabels": [
//             "release",
//             "hotfix"
//           ],
//           "prBlockLevel": "user",
//           "reviewPassedLabels": [
//             "code review passed",
//             "changes requested"
//           ]
//         },
//         "enabled": true,
//         "events": [
//           "pulls"
//         ],
//         "name": "ActivePRStatus"
//       },
//       {
//         "config": {
//           "titleRegEx": "^(?:\\[[A-Za-z0-9]+-[A-Za-z0-9]+\\])+\\s[A-Z]|Release.+"
//         },
//         "enabled": true,
//         "events": [
//           "pulls"
//         ],
//         "name": "HighlightRepoTitle"
//       },
//       {
//         "enabled": true,
//         "events": [
//           "pulls"
//         ],
//         "name": "AddNumberOfChanges"
//       }
//     ],
//     "repo": "fng-cms"
//   }
// ]
