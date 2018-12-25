/* eslint-disable no-unused-vars */

class MessageManagerHandlerInterface {
  onKeyUpdated(value) {
    throw Error('"onPageUpdate" method must be implemented');
  }
}

export default MessageManagerHandlerInterface;
