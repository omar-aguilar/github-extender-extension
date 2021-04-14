/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { isValidJSON } from './configValidator';
import styles from './JSONEditor.css';
import 'brace/mode/json'; // eslint-disable-line
import 'brace/theme/tomorrow'; // eslint-disable-line

class JSONEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      jsonError: '',
      configOpen: true,
    };
  }

  onChangeConfig = (value) => {
    const { onRepoEdit } = this.props;
    const validation = value ? isValidJSON(value) : {};
    let errorMessage = '';
    if (validation.error) {
      errorMessage = validation.error.details[0].message;
    }
    this.setState({ jsonError: errorMessage });
    onRepoEdit(value);
  }

  toggleConfig = () => {
    const { configOpen } = this.state;
    this.setState({ configOpen: !configOpen });
  }

  render() {
    const { value } = this.props;
    const { jsonError, configOpen } = this.state;
    return (
      <div className={styles.editorContainer}>
        <div className={styles.header}>
          <button type="button" className={styles.labelContainer} onClick={this.toggleConfig}>
            <div className={styles.label}>Config</div>
            <div className={`${styles.arrow} ${configOpen ? styles.down : styles.up}`} />
          </button>
          {jsonError && (
            <div className={styles.labelError}>
              <span>{jsonError}</span>
            </div>
          )}
        </div>
        {configOpen && (
          <AceEditor
            mode="json"
            theme="tomorrow"
            height="300px"
            width="100%"
            name="editor-gee"
            highlightActiveLine
            tabSize={2}
            showPrintMargin={false}
            onChange={this.onChangeConfig}
            value={value || ''}
            editorProps={{ $blockScrolling: true }}
          />
        )}
      </div>
    );
  }
}
JSONEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onRepoEdit: PropTypes.func.isRequired,
};

export default JSONEditor;
