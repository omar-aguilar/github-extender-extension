import styles from './HighlightTitle.css';

class HighlightTitle extends HTMLElement {
  connectedCallback() {
    const titleRegEx = this.getAttribute('title-reg-ex');
    const title = this.getAttribute('title');
    if (!titleRegEx) {
      return;
    }
    const prTitleRegEx = new RegExp(titleRegEx);
    if (!prTitleRegEx.test(title)) {
      const titleContainer = document.createElement('div');
      titleContainer.classList.add(styles.title);
      titleContainer.innerText = 'Incorrect Title';
      this.appendChild(titleContainer);
    }
  }
}

customElements.define('highlight-title', HighlightTitle);
