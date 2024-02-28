import React, { useState } from 'react';
import axios from 'axios';
import styles from './UpdateUser.module.css'; // Import CSS module

const UpdateUser = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      const username = formData.get('username');
      const updatedFields = {
        // Extract updated fields from formData
        // For example:
        admin_fname: formData.get('admin_fname'),
        admin_mname: formData.get('admin_mname'),
        admin_lname: formData.get('admin_lname'),
        email: formData.get('email'),
      };

      // Make an HTTP request to the backend endpoint
      const response = await axios.post('http://127.0.0.1:5000/api/v1/admin/updateUser', {
        username,
        updatedFields,
      });

      // Handle success response
      setSuccessMessage('User updated successfully');
      setErrorMessage('');
    } catch (error) {
      // Handle error response
      console.error('Error updating user:', error);
      setErrorMessage('Error updating user. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className={styles.adminMain}>
      <div className={styles.adminInfo}>
        <div className={styles.adminTabs}>
          <button onClick={() => handleTabChange('admin')} className={activeTab === 'admin' ? styles.active : ''}>Admin</button>
          <button onClick={() => handleTabChange('mentor')} className={activeTab === 'mentor' ? styles.active : ''}>Mentor</button>
          <button onClick={() => handleTabChange('student')} className={activeTab === 'student' ? styles.active : ''}>Student</button>
        </div>
        <div className={styles.adminScrollableContent}>
          <div className={styles.adminTabContent}>
            {activeTab === 'admin' && (
              <form onSubmit={handleSubmit} className={styles.updateForm}>
                <h1>Update Admin</h1>
                <table className={styles.updateFormTable}>
                  <tbody>
                    <tr className={styles.updateFormRow}>
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
                    <tr className={styles.updateFormRow}>
                      <td>
                        <label className={styles.updateEmail}>
                          Email:
                          <input type="text" name="email" />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <button className={styles.updatebtn} type="submit">Submit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            )}
            {activeTab === 'mentor' && (
              <form onSubmit={handleSubmit} className={styles.updateForm}>
                <h1>Update Mentor</h1>
                <table className={styles.updateFormTable}>
                  <tbody>
                  {activeTab === 'mentor' && (
  <form onSubmit={handleSubmit} className={styles.updateForm}>
    <h1>Update Mentor</h1>
    <table className={styles.updateFormTable}>
      <tbody>
        <tr className={styles.updateFormRow}>
          <td>
            <label>
              First Name:
              <input type="text" name="m_fname" />
            </label>
          </td>
          <td>
            <label>
              Middle Name:
              <input type="text" name="m_mname" />
            </label>
          </td>
          <td>
            <label>
              Last Name:
              <input type="text" name="m_lname" />
            </label>
          </td>
        </tr>
        <tr className={styles.updateFormRow}>
          <td>
            <label className={styles.updateEmail}>
              Email:
              <input type="text" name="email" />
            </label>
          </td>
          <td>
            <label>
              Department:
              <select name="dept_id">
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
              </select>
            </label>
          </td>
          <td>
            <label>
              Qualification:
              <input type="text" name="qualification" />
            </label>
          </td>
        </tr>
        {/* Add more fields as needed */}
        <tr>
          <td colSpan="3">
            <button className={styles.updatebtn} type="submit">Submit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
)}

                    {/* Include fields for updating mentor information */}
                  </tbody>
                </table>
              </form>
            )}
            {activeTab === 'student' && (
              <form onSubmit={handleSubmit} className={styles.updateForm}>
                <h1>Update Student</h1>
                <table className={styles.updateFormTable}>
                  <tbody>
                  {activeTab === 'student' && (
  <form onSubmit={handleSubmit} className={styles.updateForm}>
    <h1>Update Student</h1>
    <table className={styles.updateFormTable}>
      <tbody>
        <tr className={styles.updateFormRow}>
          <td>
            <label>
              First Name:
              <input type="text" name="first_name" />
            </label>
          </td>
          <td>
            <label>
              Middle Name:
              <input type="text" name="middle_name" />
            </label>
          </td>
          <td>
            <label>
              Last Name:
              <input type="text" name="last_name" />
            </label>
          </td>
        </tr>
        <tr className={styles.updateFormRow}>
          <td>
            <label className={styles.updateEmail}>
              Email:
              <input type="text" name="email" />
            </label>
          </td>
          <td>
            <label>
              Date of Birth:
              <input type="date" name="dob" />
            </label>
          </td>
          <td>
            <label>
              Department:
              <select name="dept_id">
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
              </select>
            </label>
          </td>
        </tr>
        {/* Add more fields as needed */}
        <tr>
          <td colSpan="3">
            <button className={styles.updatebtn} type="submit">Submit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
)}
                  </tbody>
                </table>
              </form>
            )}
          </div>
        </div>
      </div>
      {successMessage && <h3 style={{ color: 'black' }}>{successMessage}</h3>}
      {errorMessage && <h3 style={{ color: 'red' }}>{errorMessage}</h3>}
    </div>
  );
}

export default UpdateUser;
