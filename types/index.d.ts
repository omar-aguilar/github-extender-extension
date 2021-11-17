declare namespace EventHook {
  export type FixedSizeArray<T extends number, U> = T extends 0
    ? void[]
    : ReadonlyArray<U> & {
        0: U;
        length: T;
      };
  export type ArgumentNames<T extends any[]> = FixedSizeArray<T['length'], string>;
  export type AsArray<T> = T extends any[] ? T : [T];
  export type Arguments<T> = ArgumentNames<AsArray<T>>;
  export type HandlerFn<T> = (...args: AsArray<T>) => void;
  export type Subscription<T> = {
    name: string;
    handler: HandlerFn<T>;
  };
  export type Subscriptions<T> = Subscription<T>[];

  interface Hook<T> {
    tap: (name: string, handler: HandlerFn<T>) => void;
    call: HandlerFn<T>;
  }
}

declare namespace BrowserExtensions {
  export namespace Chrome {
    export type Tabs = typeof chrome.tabs;
    export type Tab = chrome.tabs.Tab;
    export type ValidTab = chrome.tabs.Tab & {
      url: string;
      id: number;
    };

    export type Runtime = typeof chrome.runtime;
    export type Storage = typeof chrome.storage;
  }

  export type SendMessageFn = <T>(data: T) => void;
}

declare namespace ChromeTabs {
  export type ValidTab = BrowserExtensions.Chrome.ValidTab;

  export type TabArguments = [ValidTab, BrowserExtensions.SendMessageFn];
  export type Tab = EventHook.Hook<TabArguments>;

  export type Hooks = {
    tab: Tab;
  };
}

interface ChromeTabs {
  hooks: ChromeTabs.Hooks;
}

declare namespace ChromeRuntime {
  export type MessageArguments = [any];
  export type Message = EventHook.Hook<MessageArguments>;

  export type Hooks = {
    message: Message;
  };
}

interface ChromeRuntime {
  hooks: ChromeRuntime.Hooks;
}

declare namespace ChromeStorage {
  export type StorageChanges = { [key: string]: chrome.storage.StorageChange };
  export type StorageArguments = [StorageChanges];
  export type KeyUpdated = EventHook.Hook<StorageArguments>;

  export type Hooks = {
    keyUpdated: KeyUpdated;
  };

  export type Actions = {
    getKey: (key: string) => Promise<any>;
    setKey: <T>(key: string, value: T) => Promise<boolean>;
  };
}

interface ChromeStorage {
  hooks: ChromeStorage.Hooks;
  actions: ChromeStorage.Actions;
}

declare namespace GithubPageManager {
  export type GithubPage = {
    organization: string;
    repository: string;
    section?: string;
    rest?: string[];
    search?: URLSearchParams;
  };

  export type SectionHandlers = 'pulls' | 'pull' | 'noHandler';
  export type SectionHandler = (
    githubPage: GithubPage,
    sendMessage: BGPluginManager.SendPluginMessageFn
  ) => void;
  export type SectionHandlerMap = Record<SectionHandlers, SectionHandler>;

  export type PageArguments = [GithubPage, BGPluginManager.SendPluginMessageFn, URL];
  export type Page = EventHook.Hook<PageArguments>;

  export type PullsArguments = [GithubPage, BGPluginManager.SendPluginMessageFn];
  export type Pulls = EventHook.Hook<PullsArguments>;

  export type PullArguments = [string, GithubPage, BGPluginManager.SendPluginMessageFn];
  export type Pull = EventHook.Hook<PullArguments>;

  export type Hooks = {
    page: Page;
    pulls: Pulls;
    pull: Pull;
  };
}

interface GithubPageManager {
  hooks: GithubPageManager.Hooks;
}

declare namespace BGPluginManager {
  export type SendPluginMessageFn = <T>(source: string, event: string, data: T) => void;
  export type PageArguments = [ChromeTabs.ValidTab, SendPluginMessageFn];
  export type Page = EventHook.Hook<PageArguments>;

  export type GithubConfig = {
    token: string;
  };
  type AllGlobalConfig = {
    github: GithubConfig;
  };
  export type GlobalConfig = Partial<AllGlobalConfig>;
  export type GlobalConfigChangeArguments = [GlobalConfig];
  export type GlobalConfigChange = EventHook.Hook<GlobalConfigChangeArguments>;

  export type PluginConfig = Record<string, any>;
  export type PluginConfigChangeArguments = [PluginConfig];
  export type PluginConfigChange = EventHook.Hook<PluginConfigChangeArguments>;

  export type Hooks = {
    page: Page;
    pluginConfigChange: PluginConfigChange;
    globalConfigChange: PluginConfigChange;
  };

  export type ManagerHooks = {
    github: GithubPageManager.Hooks;
  };

  export type RegisterHooks = {
    plugin: Hooks;
    manager: ManagerHooks;
  };

  export type Plugin = {
    register: (hooks: RegisterHooks) => void;
  };

  export type Extensions = {
    tabs: ChromeTabs;
    storage: ChromeStorage;
  };
  export type Plugins = Plugin[];
}

interface BGPluginManager {
  hooks: BGPluginManager.Hooks;
}

declare namespace CSPluginManager {
  export type SendPluginMessageFn = <T>(source: string, data: T) => void;
  export type MessageArguments = [string, string, any];
  export type Message = EventHook.Hook<MessageArguments>;

  export type PluginHookCallerInfo = {
    source: string;
    event: string;
  };
  export type PluginHookArguments = [any, PluginHookCallerInfo];
  export type PluginHooks = Record<string, EventHook.Hook<PluginHookArguments>>;
  export type RegisteredHooks = Record<string, PluginHooks>;
  export type RegisterHooksFn = (pluginName: string, pluginHooks: any) => void;
  export type Hooks = {
    message: Message;
  };

  export type Plugin = {
    register: (hooks: Hooks, registerHooks: RegisterHooksFn) => void;
  };

  export type Plugins = Plugin[];
}

interface CSPluginManager {
  hooks: CSPluginManager.Hooks;
}

declare module '*.svg' {
  const value: any;
  export = value;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}
