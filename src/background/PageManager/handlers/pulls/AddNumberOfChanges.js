import PageManagerHandlerInterface from '../../PageManagerHandlerInterface';

class AddNumberOfChanges extends PageManagerHandlerInterface {
  /**
   * @override
   */
  onPageUpdate(send, tab, urlMeta) {
    const message = {
      [urlMeta.page]: {
        addNumberOfChanges: [],
      },
    };
    send(message);
  }
}

export default AddNumberOfChanges;
