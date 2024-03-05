import React, { useState } from 'react';
import styles from './UpdateUser.module.css';
import axios from 'axios';

const UpdateUser = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    sex: '',
    email: '',
    student_phone_no: '',
    address: '',
    guardian: '',
    guardian_phone_no: '',
    department_id: '',
    date_of_birth: '',
    semester: '',
    qualification: ''
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleGetDetails = async (event) => {
    event.preventDefault();
    const username = formData.username.trim();
    if (!username) {
      setErrorMessage('Please enter a username');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/data?username=${username}&role=${activeTab}`);
      setUserData(response.data.data);
      setSuccessMessage('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching user details:', error);
      setErrorMessage('Error fetching user details. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/api/v1/admin/updateUser', formData);
      console.log('User updated successfully:', response.data);
      setSuccessMessage('User updated successfully');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Error updating user. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminMain}>
      <div className={styles.adminInfo}>
        <div className={styles.adminTabs}>
          <button disabled={loading} onClick={() => handleTabChange('admin')} className={`${styles.adminButton} ${activeTab === 'admin' ? styles.active : ''}`}>Admin</button>
          <button disabled={loading} onClick={() => handleTabChange('mentor')} className={`${styles.adminButton} ${activeTab === 'mentor' ? styles.active : ''}`}>Mentor</button>
          <button disabled={loading} onClick={() => handleTabChange('student')} className={`${styles.adminButton} ${activeTab === 'student' ? styles.active : ''}`}>Student</button>
        </div>
        <div className={styles.adminScrollableContent}>
          <div className={styles.adminTabContent}>
            {loading && <div>Loading...</div>}
            {successMessage && <h3 style={{ color: 'black' }}>{successMessage}</h3>}
            {errorMessage && <h3 style={{ color: 'red' }}>{errorMessage}</h3>}
            <form onSubmit={handleGetDetails} className={styles.adminForm}>
              <label>
                Username:
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter username" />
              </label>
              <button type="submit">Get Details</button>
            </form>
            {userData && (
              <form onSubmit={handleSubmit} className={styles.adminForm}>
                {/* Display fetched user details */}
                {Object.entries(userData).map(([key, value]) => (
                  <div key={key} className={styles.adminFormRow}>
                    <label>{key}</label>
                    <input type="text" name={key} value={formData[key]} onChange={handleChange} />
                  </div>
                ))}
                <button type="submit">Update User Profile</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
