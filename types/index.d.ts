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

declare namespace GithubPageManager {
  export type GithubPage = {
    organization: string;
    repository: string;
    section?: string;
    rest?: string[];
    search?: URLSearchParams;
  };

  export type PageArguments = [GithubPage, BrowserExtensions.SendMessageFn, URL];
  export type Page = EventHook.Hook<PageArguments>;

  export type Hooks = {
    page: Page;
  };
}

interface GithubPageManager {
  hooks: GithubPageManager.Hooks;
}

declare namespace BGPluginManager {
  export type SendPluginMessageFn = <T>(source: string, data: T) => void;
  export type PageArguments = [GithubPageManager.GithubPage, SendPluginMessageFn];
  export type Page = EventHook.Hook<PageArguments>;

  export type Hooks = {
    page: Page;
  };

  export type Plugin = {
    register: (hooks: Hooks) => void;
  };

  export type Plugins = Plugin[];
}

interface BGPluginManager {
  hooks: BGPluginManager.Hooks;
}

declare namespace CSPluginManager {
  export type SendPluginMessageFn = <T>(source: string, data: T) => void;
  export type MessageArguments = [string, any];
  export type Message = EventHook.Hook<MessageArguments>;

  export type Hooks = {
    message: Message;
  };

  export type Plugin = {
    register: (hooks: Hooks) => void;
  };

  export type Plugins = Plugin[];
}

interface CSPluginManager {
  hooks: CSPluginManager.Hooks;
}
