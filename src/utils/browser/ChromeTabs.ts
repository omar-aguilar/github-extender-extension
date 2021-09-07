import Hook from '../Hook';

function ChromeTabs(tabs: BrowserExtensions.Chrome.Tabs): ChromeTabs {
  const hooks = {
    tab: Hook<ChromeTabs.TabArguments>(['tab', 'sendMessage']),
  };

  function isValidTab(tab: BrowserExtensions.Chrome.Tab): tab is ChromeTabs.ValidTab {
    const currentTab = tab as ChromeTabs.ValidTab;
    return currentTab.id !== undefined && currentTab.url !== undefined;
  }

  function getSendMessageFn(tab: ChromeTabs.ValidTab) {
    return (data: unknown): void => {
      tabs.sendMessage(tab.id, data);
    };
  }

  function onPageUpdateReceived(tab: BrowserExtensions.Chrome.Tab) {
    if (!isValidTab(tab)) {
      return;
    }
    const sendMessage = getSendMessageFn(tab);
    hooks.tab.call(tab, sendMessage);
  }

  function init() {
    tabs.onCreated.addListener(onPageUpdateReceived);
    tabs.onUpdated.addListener((_, changeInfo, tab) => {
      if (changeInfo.status !== 'complete') {
        return;
      }
      onPageUpdateReceived(tab);
    });
  }

  init();

  return {
    hooks,
  };
}

export default ChromeTabs;
