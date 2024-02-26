import React from 'react';
import styles from './DeleteUser.module.css'; // Import CSS module

const DeleteUser = () => {
  return (
    <div className={styles.infoContainer}>
      <div className={styles.data_panel}>
        <h1>Delete User</h1>
        <div className={styles.userInfo}>
          {/* Your user info content goes here */}
        </div>
      </div>
    </div>
  );
}

export default DeleteUser;
