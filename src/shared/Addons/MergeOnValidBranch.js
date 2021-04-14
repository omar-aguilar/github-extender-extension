import AddonBase from './AddonBase';

class MergeOnValidBranch extends AddonBase {
  exec() {
    const { validBranches } = this.config;
    const message = {
      handler: 'mergeOnValidBranch',
      params: [validBranches],
    };
    return message;
  }
}

export default MergeOnValidBranch;
