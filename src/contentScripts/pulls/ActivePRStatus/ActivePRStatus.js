import styles from './ActivePRStatus.css';

class ActivePRStatus extends HTMLElement {
  connectedCallback() {
    const isBlocked = Boolean(+this.getAttribute('is-blocked'));
    if (!isBlocked) {
      return;
    }
    const blockContainer = document.createElement('div');
    blockContainer.innerText = 'Please Review Other PRs First';
    blockContainer.classList.add(styles['active-status']);
    this.appendChild(blockContainer);
  }
}

customElements.define('pr-status', ActivePRStatus);
