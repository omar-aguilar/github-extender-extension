/* eslint-disable no-unused-vars */

class MessageManagerHandlerInterface {
  onMessage(value) {
    throw Error('"onMessage" method must be implemented');
  }
}

export default MessageManagerHandlerInterface;
