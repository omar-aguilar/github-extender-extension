/* eslint-disable no-unused-vars */

class HandlerInterface {
  onPageUpdate(send, tab, urlMeta, config) {
    throw Error('"onPageUpdate" method must be implemented');
  }

  onMessage(send, urlMeta, config, message) {
    throw Error('"onMessage" method must be implemented');
  }
}

export default HandlerInterface;
