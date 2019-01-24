import React from 'react';
import StorageManager from 'shared/StorageManager';

const withStorageManager = ComponentWrapper => (
  class extends React.Component {
    constructor(props) {
      super(props);
      const storageManager = new StorageManager();
      storageManager.subscribe('report', this);

      this.getKey = storageManager.getKey.bind(storageManager);
      this.setKey = storageManager.setKey.bind(storageManager);
      this.updateReport = this.updateReport.bind(this);

      this.getKey('report').then(({ report }) => this.updateReport(report));
      this.state = {
        report: {},
      };
    }

    onKeyUpdated(report) {
      this.updateReport(report);
    }

    updateReport(report) {
      console.log('report', report);
      this.setState({ report });
    }

    render() {
      const { report } = this.state;
      return <ComponentWrapper setKey={this.setKey} getKey={this.getKey} report={report} />;
    }
  }
);

export default withStorageManager;
