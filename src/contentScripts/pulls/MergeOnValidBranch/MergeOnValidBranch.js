import split from 'assets/split.svg';

import styles from './MergeOnValidBranch.css';

class MergeOnValidBranch extends HTMLElement {
  connectedCallback() {
    const mergeOnValidBranch = document.createElement('span');
    mergeOnValidBranch.classList.add(styles['svg-container']);
    mergeOnValidBranch.innerHTML = split;
    this.appendChild(mergeOnValidBranch);
  }
}

customElements.define('merge-on-valid-branch', MergeOnValidBranch);
