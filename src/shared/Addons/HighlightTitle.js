
import AddonBase from './AddonBase';

class HighlightTitle extends AddonBase {
  exec() {
    const { titleRegEx } = this.config;
    const message = {
      handler: 'highlightTitle',
      params: [titleRegEx],
    };
    return message;
  }
}

export default HighlightTitle;
