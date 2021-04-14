import React from 'react';
import StorageManager from 'shared/StorageManager';

const withExtensionStorage = WrappedComponent => (
  class extends React.Component {
    static displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    constructor(props) {
      super(props);
      const storageManager = new StorageManager();
      this.getKey = storageManager.getKey.bind(storageManager);
      this.setKey = storageManager.setKey.bind(storageManager);
    }

    render() {
      return <WrappedComponent setKey={this.setKey} getKey={this.getKey} {...this.props} />;
    }
  }
);

export default withExtensionStorage;
