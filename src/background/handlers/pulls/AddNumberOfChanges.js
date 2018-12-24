import HandlerInterface from '../HandlerInterface';

class AddNumberOfChanges extends HandlerInterface {
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
