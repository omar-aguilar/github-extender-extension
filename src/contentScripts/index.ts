import { ContentScriptUIFn } from 'src/types';
import ActivePRStatusUI from '../plugins/ActivePRStatus/UI';
import { UI_ID as ActivePRStatusUIID } from '../plugins/ActivePRStatus/constants';

const { runtime } = chrome;

const UIFeatures: Record<string, ContentScriptUIFn> = {
  [ActivePRStatusUIID]: ActivePRStatusUI,
};

// listen from background
runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { selector, uiId } = request as { selector: string; uiId: string };
  console.log(selector, uiId);
  document.querySelectorAll(selector).forEach((elem) => {
    UIFeatures[uiId]?.(elem);
  });
});

console.log('content script loaded');
