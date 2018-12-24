import HandlerInterface from '../HandlerInterface';

class HighlightPRTitle extends HandlerInterface {
  onPageUpdate(send, tab, urlMeta, config) {
    const { titleRegEx } = config;
    const message = {
      [urlMeta.page]: {
        highlightPRTitle: [titleRegEx],
      },
    };
    send(message);
  }
}

export default HighlightPRTitle;
