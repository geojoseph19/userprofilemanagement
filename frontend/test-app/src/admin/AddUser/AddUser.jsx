import React, { useState } from 'react';
import styles from './AddUser.module.css';
import axios from 'axios';
 
const AddUser = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
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
          sex: mapSex(event.target.elements.sex.value), // Map sex value
          student_phone_no: event.target.elements.student_phone_no.value,
          email: event.target.elements.email.value,
          address: event.target.elements.address.value,
          dob: event.target.elements.dob.value,
          dept_id: mapDepartment(event.target.elements.dept_id.value), // Map department ID
          semester: event.target.elements.semester.value,
          guardian_name: event.target.elements.guardian_name.value,
          guardian_phone_no: event.target.elements.guardian_phone_no.value,
        };
      }
      const response = await axios.post('http://127.0.0.1:5000/api/v1/admin/createUser', formData);
  
      // Handle successful response
      console.log('User created successfully:', response.data);
      
      // Set success message
      setSuccessMessage('User created successfully');
  
      // Clear form or do any additional logic here
    } catch (error) {
      // Handle errors
      console.error('Error creating user:', error);
    }
  };
  
  // Function to map sex value
  const mapSex = (sexValue) => {
    switch (sexValue) {
      case 'male':
        return 'm';
      case 'female':
        return 'f';
      case 'other':
        return 'o';
      default:
        return '';
    }
  };
  const mapDepartment = (deptId) => {
    // Custom mapping for department ID 1
    if (deptId === 'a') {
      return 'dept5';
    }
    // Add more custom mappings if needed
    return deptId; // Default mapping
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
            {successMessage && <h3 style={{ color: 'black' }}>{successMessage}</h3>}
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
            {activeTab === 'student' && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h1>Create Student</h1>
                <table className={styles.formTable}>
                  <tbody>
                    <tr className={styles.formRow}>
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
                    <tr className={styles.formRow}>
                      <td className={styles.halfColumn}>
                        <label className={styles.half}>
                          Sex:
                          <select name="sex">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </label>
                        <label className={styles.half}>
                          Semester:
                          <select name="semester">
                            {[...Array(8)].map((_, index) => (
                              <option key={index + 1} value={index + 1}>{index + 1}</option>
                            ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          Student Phone Number:
                          <input type="text" name="student_phone_no" />
                        </label>
                      </td>
                      <td>
                        <label className={styles.email}>
                          Email:
                          <input type="text" name="email" />
                        </label>
                      </td>
                    </tr>
                    <tr className={styles.formRow}>
                      <td>
                        <label>
                          Date of Birth:
                          <input type="date" name="dob" />
                        </label>
                      </td>
                      <td colSpan={2}>
                        <label className={styles.address}>
                          Address:
                          <textarea name="address" rows="4" />
                        </label>
                      </td>
                    </tr>
                    <tr className={styles.formRow}>
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
                      <td colSpan="1">
                        <label>
                          Guardian Name:
                          <input type="text" name="guardian_name" />
                        </label>
                      </td>
                      <td colSpan="1">
                        <label>
                          Guardian Phone Number:
                          <input type="text" name="guardian_phone_no" />
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
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default AddUser;
 