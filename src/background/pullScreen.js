// Pulls Screen
/**
 * NOTE: As this screen gets executed every time a change is made to the url
 * we cannot make const functions as it will raise an error as the variable will
 * be defined since the first run.
 */

// Mark PR title doesn't match
(() => {
  const prTitleRegEx = /^(?:\[[A-Za-z0-9]+-[A-Za-z0-9]+\])+\s[A-Z]|Release \d+\.\d+\.\d+/;
  [...document.getElementsByClassName('link-gray-dark v-align-middle no-underline h4 js-navigation-open')]
    .forEach((elem) => {
      const title = elem.innerText;
      const backgroundColor = '#B33A3A';
      if (!prTitleRegEx.test(title)) {
        const prLine = elem.parentNode.parentNode;
        prLine.style.backgroundColor = backgroundColor;
      }
    });
})();

// Add number of Approvals / Change Requested / etc.
(() => {
  [...document.getElementsByClassName('muted-link tooltipped tooltipped-s')]
    .forEach((elem) => {
      const customElem = elem; // trick eslint :P
      const counterClassName = 'github-extension-counter-label';
      const label = elem.getAttribute('aria-label');
      const [nApprovals] = label.match(/(\d+)/) || [];
      if (nApprovals) {
        const [counterSpan] = elem.getElementsByClassName(counterClassName);
        const spanElem = counterSpan || document.createElement('span');
        spanElem.className = counterClassName;
        spanElem.innerText = `(${nApprovals})`;
        customElem.innerHTML = `${elem.innerText} ${spanElem.outerHTML}`;
      }
    });
})();
