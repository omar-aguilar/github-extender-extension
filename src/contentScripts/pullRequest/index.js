// Mark PR whose title doesn't match certain Regex
const markIncorrectPRTitles = ({ titleRegEx } = {}) => {
  if (!titleRegEx) {
    return;
  }
  const prTitleRegEx = new RegExp(titleRegEx);
  [...document.getElementsByClassName('link-gray-dark v-align-middle no-underline h4 js-navigation-open')]
    .forEach((elem) => {
      const title = elem.innerText;
      const backgroundColor = '#B33A3A';
      if (!prTitleRegEx.test(title)) {
        const prLine = elem.parentNode.parentNode;
        prLine.style.backgroundColor = backgroundColor;
      }
    });
};

// Add number of Approvals / Change Requested / etc.
const addNumberOfChanges = () => {
  [...document.getElementsByClassName('muted-link tooltipped tooltipped-s')]
    .forEach((elem) => {
      const counterClassName = 'github-extension-counter-label';
      const label = elem.getAttribute('aria-label');
      const [nApprovals] = label.match(/(\d+)/) || [];
      if (nApprovals) {
        const [counterSpan] = elem.getElementsByClassName(counterClassName);
        const spanElem = counterSpan || document.createElement('span');
        if (!counterSpan) {
          elem.appendChild(spanElem);
        }
        spanElem.className = counterClassName;
        spanElem.innerText = `(${nApprovals})`;
      }
    });
};

const refresh = (params) => {
  markIncorrectPRTitles(params);
  addNumberOfChanges();
};

const messageListener = (request, sender, sendResponse) => {
  console.log('request', request);
  console.log('sender', sender);
  const { pr } = request;
  if (pr) {
    if (pr.refresh) {
      refresh(pr.refresh);
      sendResponse({
        pr: {
          refreshed: true,
        },
      });
    }
  }
};

chrome.runtime.onMessage.addListener(messageListener);
refresh();
