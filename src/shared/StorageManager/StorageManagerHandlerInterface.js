/* eslint-disable no-unused-vars */

class StorageManagerHandlerInterface {
  onKeyUpdated(value) {
    throw Error('"onKeyUpdated" method must be implemented');
  }
}

export default StorageManagerHandlerInterface;
