class ExtensionAPI {
  static browser = 'chrome';

  static getApi(api) {
    if (ExtensionAPI.browser === 'chrome') {
      return chrome[api];
    }
    return window[api];
  }

  static get alarms() {
    return ExtensionAPI.getApi('alarms');
  }

  static get tabs() {
    return ExtensionAPI.getApi('tabs');
  }

  static get storage() {
    return ExtensionAPI.getApi('storage');
  }

  static get runtime() {
    return ExtensionAPI.getApi('runtime');
  }
}

export default ExtensionAPI;
