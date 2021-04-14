import ExtensionWrapper from 'shared/ExtensionWrapper';

import './OpenTimeMeter';
import './AddNumberOfChanges';
import './ActivePRStatus';
import './MergeOnValidBranch';

import styles from './pulls.css';

const runtime = ExtensionWrapper.getApi('runtime');

const pulls = {
  // Add an icon if the PR has been open for a long time
  openTimeMeter: (maxDays) => {
    const selector = 'opened-by';
    [...document.getElementsByClassName(selector)]
      .forEach((elem) => {
        const meterClassName = 'gee-meter-container';
        if (elem.getElementsByClassName(meterClassName).length) {
          return;
        }

        const openTimeElem = elem.querySelector('relative-time');
        const datetime = openTimeElem.getAttribute('datetime');
        const meterContainer = document.createElement('open-time-meter');
        meterContainer.classList.add(meterClassName);
        meterContainer.setAttribute('max-days', maxDays);
        meterContainer.setAttribute('datetime', datetime);
        elem.insertBefore(meterContainer, elem.childNodes[4]);
      });
  },
  // Mark PR whose title doesn't match certain Regex
  highlightTitle: (titleRegEx) => {
    const selector = 'link-gray-dark v-align-middle no-underline h4 js-navigation-open';
    [...document.getElementsByClassName(selector)]
      .forEach((elem) => {
        const title = elem.innerText;
        const prTitleRegEx = new RegExp(titleRegEx);
        if (prTitleRegEx.test(title)) {
          return;
        }
        const { style } = elem;
        style.setProperty('text-decoration', 'line-through', 'important');
        style.backgroundColor = '#ef9a9a';
      });
  },
  // Add number of Approvals / Change Requested / etc.
  addNumberOfChanges: () => {
    const selector = 'muted-link tooltipped tooltipped-s';
    [...document.getElementsByClassName(selector)]
      .forEach((elem) => {
        const counterClassName = 'gee-counter-label';
        if (elem.getElementsByClassName(counterClassName).length) {
          return;
        }

        const label = elem.getAttribute('aria-label');
        const [count] = label.match(/(\d+)/) || [];
        const numberOfChangesContainer = document.createElement('number-of-changes');
        numberOfChangesContainer.classList.add(counterClassName);
        numberOfChangesContainer.setAttribute('count', count);
        elem.appendChild(numberOfChangesContainer);
      });
  },
  // Add a block if the PR is blocked because the owner has not reviewed other PRs
  activePRStatus: (prStatus) => {
    const selector = 'link-gray-dark v-align-middle no-underline h4 js-navigation-open';
    [...document.getElementsByClassName(selector)]
      .forEach((elem) => {
        const [number] = elem.href.match(/(\d+)$/g) || [];
        const { isBlocked } = prStatus.find((pr) => +pr.number === +number) || {};
        const pr = document.getElementById(`issue_${number}`);
        const prClassName = 'gee-pr-status';
        if (elem.getElementsByClassName(prClassName).length) {
          return;
        }
        const block = document.createElement('pr-status');
        block.classList.add(prClassName);
        block.setAttribute('is-blocked', +isBlocked);
        pr.classList.add(styles.relative);
        pr.appendChild(block);
      });
  },
  mergeOnValidBranch: (validBranches) => {
    const selector = 'link-gray-dark v-align-middle no-underline h4 js-navigation-open';
    const validBranchesSet = new Set(validBranches);
    [...document.getElementsByClassName(selector)].forEach((elem) => {
      const hoverCardUrlAttribute = 'data-hovercard-url';
      const url = elem.getAttribute(hoverCardUrlAttribute);
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
      };
      fetch(url, { headers })
        .then((response) => response.text())
        .then((html) => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          const involvedBranchesClass = 'commit-ref';
          const [base] = [...tempDiv.getElementsByClassName(involvedBranchesClass)].map((elem) => elem.innerText.trim());
          if (!validBranchesSet.has(base)) {
            const mergeOnValidBranch = document.createElement('merge-on-valid-branch');
            const number = elem.getAttribute('href').split('/').pop();
            const pr = document.getElementById(`issue_${number}`);
            const [destinationNode] = pr.getElementsByClassName('flex-shrink-0 col-3 pt-2 text-right pr-3 no-wrap d-flex hide-sm ');
            destinationNode.appendChild(mergeOnValidBranch);
          }
        });
    });
  },
};

// eslint-disable-next-line no-unused-vars
const messageListener = (request, sender, sendResponse) => {
  console.log('message', request);
  if (request.pulls) {
    // Message In
    const { handler, params } = request.pulls;
    const pullHandler = pulls[handler];
    if (pullHandler) {
      pullHandler(...params);
    }
    // Message Out
    //   Not yet used
  }
};

// listen from background
runtime.onMessage.addListener(messageListener);
