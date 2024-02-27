import React, { useState } from 'react';
import styles from './DeleteUser.module.css';
import axios from 'axios';

const DeleteUser = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.delete(`http://127.0.0.1:5000/api/v1/admin/removeUser?username=${username}`);
      
      console.log('User deleted successfully:', response.data);
      
      setSuccessMessage('User deleted successfully');
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Error deleting user. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className={styles.adminMain}>
      <div className={styles.adminInfo}>
        <div className={styles.adminScrollableContent}>
          <div className={styles.adminTabContent}>

            {loading && <div>Loading...</div>}
            {successMessage && (
              <div>
                <h3 style={{ color: 'black' }}>{successMessage}</h3>
                <button className={styles.deleteBtn} onClick={handleGoBack}>Go Back</button>
              </div>
            )}
            {errorMessage && (
              <div>
                <h3 style={{ color: 'red' }}>{errorMessage}</h3>
                <button className={styles.deleteBtn} onClick={handleGoBack}>Go Back</button>
              </div>
            )}
            {!successMessage && !errorMessage && (
              <form onSubmit={handleSubmit} className={styles.deleteForm}>
                <h1>Delete User</h1>
                <table className={styles.deleteFormTable}>
                  <tbody>
                    <tr className={styles.deleteFormRow}>
                      <td>
                        <label>
                          Enter the username:
                          <input 
                            type="text" 
                            name="username" placeholder='username'
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                          />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button className={styles.btn} type="submit">Delete User</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
