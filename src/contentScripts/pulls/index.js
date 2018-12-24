import styles from './pulls.css';

const prSelector = 'link-gray-dark v-align-middle no-underline h4 js-navigation-open';

// Mark PR whose title doesn't match certain Regex
const highlightPRTitle = (titleRegEx) => {
  if (!titleRegEx) {
    return;
  }
  const prTitleRegEx = new RegExp(titleRegEx);
  console.log('prTitleRegEx', prTitleRegEx, titleRegEx, prTitleRegEx.test('[DPP-301] A'));
  [...document.getElementsByClassName(prSelector)]
    .forEach((elem) => {
      const title = elem.innerText;
      const backgroundColor = '#B33A3A';
      if (!prTitleRegEx.test(title)) {
        const [number] = elem.href.match(/(\d+)$/g) || [];
        const prLine = document.getElementById(`issue_${number}`);
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

const addBlockPRDiv = (number, isBlocked = false) => {
  const searchClassName = styles.mark;
  const pr = document.getElementById(`issue_${number}`);
  const currentDiv = pr.getElementsByClassName(searchClassName)[0];
  if (!isBlocked) {
    if (currentDiv) {
      pr.removeChild(currentDiv);
    }
    return;
  }
  if (!pr.className.includes(styles.markPrTitle)) {
    pr.className = `${pr.className} ${styles.markPrTitle}`;
  }
  const div = currentDiv || document.createElement('div');
  div.innerText = 'Please Review Other PRs First :P';
  div.className = searchClassName;
  if (!currentDiv) {
    pr.appendChild(div);
  }
};

const setPrStatus = (prStatus) => {
  [...document.getElementsByClassName(prSelector)]
    .forEach((elem) => {
      const [number] = elem.href.match(/(\d+)$/g) || [];
      const { isBlocked } = prStatus.find(pr => pr.number == number) || {}; // eslint-disable-line
      addBlockPRDiv(number, isBlocked);
    });
};

// eslint-disable-next-line no-unused-vars
const messageListener = (request, sender, sendResponse) => {
  console.log('message', request);
  const { pulls } = request;
  if (pulls) {
    // Message In
    if (pulls.highlightPRTitle) {
      console.log('highlight pr');
      highlightPRTitle(...pulls.highlightPRTitle);
    }
    if (pulls.addNumberOfChanges) {
      console.log('number of changes');
      addNumberOfChanges();
    }
    if (pulls.prStatus) {
      console.log('got pr status');
      setPrStatus(pulls.prStatus);
    }

    // Message Out
  }
};

// listen from background
chrome.runtime.onMessage.addListener(messageListener);
