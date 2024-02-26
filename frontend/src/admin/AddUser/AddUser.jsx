import React, { useState } from 'react';
import styles from './AddUser.module.css';
import axios from 'axios';

const AddUser = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Fetch form data based on the active tab
      let formData = {};
      if (activeTab === 'admin') {
        formData = new FormData(event.target);
      } else if (activeTab === 'mentor') {
        // Populate formData for mentor tab
      } else if (activeTab === 'student') {
        formData = {
          role_type: 'student',
          first_name: event.target.elements.first_name.value,
          middle_name: event.target.elements.middle_name.value,
          last_name: event.target.elements.last_name.value,
          sex: event.target.elements.sex.value,
          student_phone_no: event.target.elements.student_phone_no.value,
          email: event.target.elements.email.value,
          address: event.target.elements.address.value,
          dob: event.target.elements.dob.value,
          dept_id: event.target.elements.dept_id.value,
          semester: event.target.elements.semester.value,
          guardian_name: event.target.elements.guardian_name.value,
          guardian_phone_no: event.target.elements.guardian_phone_no.value
        };
      }
      const response = await axios.post('http://127.0.0.1:5000/api/v1/admin/createUser', formData);
  
      // Handle successful response
      console.log('User created successfully:', response.data);
  
      // Clear form or do any additional logic here
    } catch (error) {
      // Handle errors
      console.error('Error creating user:', error);
    }
  };
  

  return (
    <div className={styles.main}>
      <div className={styles.info}>
        <div className={styles.tabs}>
          <button disabled={loading} onClick={() => handleTabChange('admin')} className={activeTab === 'admin' ? styles.active : ''}>Admin</button>
          <button disabled={loading} onClick={() => handleTabChange('mentor')} className={activeTab === 'mentor' ? styles.active : ''}>Mentor</button>
          <button disabled={loading} onClick={() => handleTabChange('student')} className={activeTab === 'student' ? styles.active : ''}>Student</button>
        </div>
        <div className={styles.scrollableContent}>
          <div className={styles.tabContent}>
            {loading && <div>Loading...</div>}
            {activeTab === 'admin' && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h1>Create Admin</h1>
                <table className={styles.formTable}>
                  <tbody>
                    <tr className={styles.formRow}>
                      <td>
                        <label>
                          First Name:
                          <input type="text" name="admin_fname" />
                        </label>
                      </td>
                      <td>
                        <label>
                          Middle Name:
                          <input type="text" name="admin_mname" />
                        </label>
                      </td>
                      <td>
                        <label>
                          Last Name:
                          <input type="text" name="admin_lname" />
                        </label>
                      </td>
                    </tr>
                    <tr className={styles.formRow}>
                      <td>
                        <label className={styles.email}>
                          Email:
                          <input type="text" name="email" />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <button type="submit">Submit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            )}
            {/* Add other form sections for mentor and student */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
