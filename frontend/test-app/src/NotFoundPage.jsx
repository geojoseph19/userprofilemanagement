import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import styles from './NotFoundPage.module.css'; // Import your CSS module for styling

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.image}></div>
      {/* Use the Link component instead of <a> */}
      <div className={styles.btnn}>
      <Link to="/" className={styles.buttonn}>Go to Home</Link>
    </div></div>
  );
}

export default NotFound;
