import AddonBase from './AddonBase';

class OpenTimeMeter extends AddonBase {
  exec() {
    const { maxDays = 7 } = this.config;
    const message = {
      handler: 'openTimeMeter',
      params: [maxDays],
    };
    return message;
  }
}

export default OpenTimeMeter;
