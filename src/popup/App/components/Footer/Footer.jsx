import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Footer.css';

const Footer = ({ children, className }) => (
  <div className={classNames(styles.footer, className)}>
    {children}
  </div>
);

Footer.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

Footer.defaultProps = {
  className: null,
};

export default Footer;
