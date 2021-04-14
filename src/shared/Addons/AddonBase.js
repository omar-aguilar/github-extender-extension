class AddonBase {
  constructor(config, globalConfig) {
    this.config = config || {};
    this.globalConfig = globalConfig;
  }

  _onConfigUpdate = (config) => {
    this.config = config;
  }

  _onGlobalConfigUpdate = (globalConfig) => {
    this.globalConfig = globalConfig;
  }

  // eslint-disable-next-line no-unused-vars
  exec(callerUrl) {
    throw Error('exec should be implemented');
  }
}

export default AddonBase;
