// AuthWrapper.js

import React from 'react';
import styles from './AuthWrapper.module.css'; // Import CSS module for styling

function AuthWrapper({ animateBackground, children }) {
  return (
    <div className={styles['body-container']}>
      <div className={styles['background-animation'] + (animateBackground ? ' ' + styles['animate'] : '')}></div>
      <div className={styles['content']}>
        {children}
      </div>
    </div>
  );
}

export default AuthWrapper;
