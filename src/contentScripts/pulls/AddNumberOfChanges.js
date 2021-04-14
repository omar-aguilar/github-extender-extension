class AddNumberOfChanges extends HTMLElement {
  connectedCallback() {
    const count = this.getAttribute('count') | 0;
    if (count === 0) {
      return;
    }
    const numberOfChangesContainer = document.createElement('span');
    numberOfChangesContainer.innerText = `(${count})`;
    this.appendChild(numberOfChangesContainer);
  }
}

customElements.define('number-of-changes', AddNumberOfChanges);
