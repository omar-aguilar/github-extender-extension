import styles from './OpenTimeImage.scss';
import flame from '../../assets/flame-danger-svgrepo-com.svg';
import time from '../../assets/time-svgrepo-com.svg';

function getOpenTimeImage(percentage: number): HTMLSpanElement {
  const openTimeImage = document.createElement('span');

  if (percentage < 50) {
    openTimeImage.innerHTML = time;
    openTimeImage.classList.add(styles.ok);
    return openTimeImage;
  }
  if (percentage < 85) {
    openTimeImage.innerHTML = time;
    openTimeImage.classList.add(styles.warning);
    return openTimeImage;
  }
  openTimeImage.innerHTML = flame;
  openTimeImage.classList.add(styles.fire);
  return openTimeImage;
}

class OpenTimeImage extends HTMLElement {
  connectedCallback() {
    const maxDaysAttr = this.getAttribute('max-days');
    const openAt = this.getAttribute('datetime');
    if (!maxDaysAttr || !openAt) {
      const emptyElem = document.createElement('span');
      this.appendChild(emptyElem);
      return;
    }

    const maxDays = parseInt(maxDaysAttr, 10);
    const offsetTop = 1000 * 60 * 60 * 24 * maxDays;
    const openTime = +new Date(openAt);
    const currentTime = Date.now();
    const elapsedTime = currentTime - openTime;
    const expiredPercentage = Math.min(100, (elapsedTime * 100) / offsetTop);

    const meterContainer = document.createElement('span');
    meterContainer.style.position = 'relative';
    meterContainer.style.display = 'inline-flex';
    meterContainer.style.alignItems = 'center';
    meterContainer.style.margin = '0 8px';

    const expiredImage = getOpenTimeImage(expiredPercentage);
    meterContainer.appendChild(expiredImage);

    this.appendChild(meterContainer);
  }
}

customElements.define('open-time-img', OpenTimeImage);
