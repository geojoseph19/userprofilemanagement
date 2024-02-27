import React from 'react';
import styles from './NotFoundPage.module.css'; 

function NotFoundPage() {
  return (
    <div className={styles['body-container']} style={{display:'block', alignContent:'center', marginLeft:'40%'}}>
      <h1 style={{color:'rgb(49, 49, 49)'}}>404 Not Found</h1>
      <p style={{color:'rgb(49, 49, 49)'}}>Sorry, the page you are looking for does not exist or you are not authorized to access it.</p>
    </div>
  );
}

export default NotFoundPage;
