import AddonBase from './AddonBase';

class AddNumberOfChanges extends AddonBase {
  exec() {
    const message = {
      handler: 'addNumberOfChanges',
      params: [],
    };
    return message;
  }
}

export default AddNumberOfChanges;
