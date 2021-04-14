import expiredSvg from 'assets/expired.svg';
import accessTimeSvg from 'assets/accessTime.svg';
import fireGif from 'assets/fire.gif';

import styles from './OpenTimeMeter.css';

class OpenTimeMeter extends HTMLElement {
  connectedCallback() {
    const maxDays = this.getAttribute('max-days') | 0;
    const openAt = this.getAttribute('datetime');
    const offsetTop = 1000 * 60 * 60 * 24 * maxDays;
    const openTime = +new Date(openAt);
    const currentTime = Date.now();
    const elapsedTime = currentTime - openTime;
    const point = Math.min(100, elapsedTime * 100 / offsetTop | 0);

    const meterContainer = document.createElement('span');
    meterContainer.style.position = 'relative';
    meterContainer.style.display = 'inline-flex';
    meterContainer.style.alignItems = 'center';
    meterContainer.style.marginRight = '8px';

    const expiredImage = document.createElement('span');
    expiredImage.style.width = '20px';
    expiredImage.style.height = '20px';
    expiredImage.innerHTML = point < 50 ? accessTimeSvg : expiredSvg;

    let colorClass = 'red';
    if (point < 50) {
      colorClass = 'green';
    } else if (point < 85) {
      colorClass = 'yellow';
    }
    expiredImage.classList.add(styles['expired-svg-container']);
    expiredImage.classList.add(styles[colorClass]);
    meterContainer.appendChild(expiredImage);

    if (point >= 90) {
      const image = document.createElement('img');
      image.width = '14';
      image.height = '14';
      image.src = fireGif;
      meterContainer.appendChild(image);
    }

    this.appendChild(meterContainer);
  }
}

customElements.define('open-time-meter', OpenTimeMeter);
