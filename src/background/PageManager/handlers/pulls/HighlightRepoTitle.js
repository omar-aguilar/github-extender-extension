import PageManagerHandlerInterface from '../../PageManagerHandlerInterface';

class HighlightPRTitle extends PageManagerHandlerInterface {
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