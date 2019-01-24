import React from 'react';
import PropTypes from 'prop-types';

import styles from './Report.css';

class Report extends React.Component {
  _getSingleUserReport(report, user) {
    const { blocked = {}, shameList = {} } = report;
    const block = (blocked.data || []).find(data => data.user === user);
    const shame = (shameList.data || []).find(data => data.user === user);
    const blockSummary = block
      ? (
        <div className={styles.reportSection}>
          <span className={styles.reportSectionTitle}>Your Blocked PRs: </span>
          <span>{block.prLinks.map(({ number }) => number).join(',')}</span>
        </div>
      ) : null;
    const shameSummary = shame
      ? (
        <div className={styles.reportSection}>
          <span className={styles.reportSectionTitle}>PRs you need to review: </span>
          <span>
            {
              shame.prLinks.map(({ link, number }, idx) => (
                <a
                  key={`shame-${idx}`} // eslint-disable-line
                  rel="noopener noreferrer"
                  href={link}
                  target="_blank"
                >
                  {number}
                </a>
              ))
            }
          </span>
        </div>
      ) : null;
    const reportBody = blockSummary || shameSummary
      ? (
        <div>
          {blockSummary}
          {shameSummary}
        </div>
      )
      : (
        <div className={styles.reportSection}>
          Nothing pending&nbsp;
          <span role="img" aria-label="party popper">&#x1F389;</span>
        </div>
      );

    return (
      <div>
        <div className={styles.reportUser}>{user}</div>
        {reportBody}
        <div className={styles.reportTime}>
          <span className={styles.reportTimeLabel}>Report Time: </span>
          <span className={styles.reportTimeDate}>{new Date(report.time).toLocaleString()}</span>
        </div>
      </div>
    );
  }

  renderReport() {
    const { report, reportConfig } = this.props;
    const { user, usersInReport } = reportConfig;
    const uniqueUsers = new Set(usersInReport);
    if (!uniqueUsers.has(user)) {
      return (<div>User must be in the users in report list</div>);
    }
    return this._getSingleUserReport(report, user);
  }

  render() {
    return (
      <div className={styles.reportView}>
        <div className={styles.reportTitle}>Block Report</div>
        <div className={styles.reportContent}>
          {this.renderReport()}
        </div>
      </div>
    );
  }
}

Report.propTypes = {
  report: PropTypes.shape({}),
  reportConfig: PropTypes.shape({}),
};

Report.defaultProps = {
  report: {},
  reportConfig: {},
};

export default Report;
