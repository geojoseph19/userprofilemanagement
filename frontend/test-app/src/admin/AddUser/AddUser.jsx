import React, { useState } from 'react';
import styles from './AddUser.module.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AddUser = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let formData = {};
      if (activeTab === 'admin') {
        formData = {
          role_type: 'admin',
          first_name: event.target.elements.admin_fname.value,
          middle_name: event.target.elements.admin_mname.value,
          last_name: event.target.elements.admin_lname.value,
          email: event.target.elements.email.value,
        };
      } else if (activeTab === 'mentor') {
        formData = {
          role_type: 'mentor',
          first_name: event.target.elements.first_name.value,
          middle_name: event.target.elements.middle_name.value,
          last_name: event.target.elements.last_name.value,
          qualification: event.target.elements.qualification.value,
          department_id: mapDepartment(event.target.elements.dept_id.value),
          email: event.target.elements.email.value,
        };
      } else if (activeTab === 'student') {
        formData = {
          role_type: 'student',
          first_name: event.target.elements.first_name.value,
          middle_name: event.target.elements.middle_name.value,
          last_name: event.target.elements.last_name.value,
          sex: mapSex(event.target.elements.sex.value),
          student_phone_no: event.target.elements.student_phone_no.value,
          email: event.target.elements.email.value,
          address: event.target.elements.address.value,
          dob: event.target.elements.dob.value,
          dept_id: mapDepartment(event.target.elements.dept_id.value),
          semester: event.target.elements.semester.value,
          guardian_name: event.target.elements.guardian_name.value,
          guardian_phone_no: event.target.elements.guardian_phone_no.value,
        };
      }

      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/api/v1/admin/createUser', formData);

      console.log('User created successfully:', response.data);
      
      toast.success("User created successfully",{ autoClose : 5000});
 
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error("Error creating user. please try again.",{ autoClose : 5000});
    } finally {
      setLoading(false);
    }
  };

  const mapSex = (sexValue) => {
    switch (sexValue) {
      case 'male':
        return 'M';
      case 'female':
        return 'F';
      case 'other':
        return 'O';
      default:
        return '';
    }
  };

  const mapDepartment = (deptId) => {
    switch (deptId) {
      case 'CS':
        return 'dept1';
      case 'EEE':
        return 'dept2';
      case 'ECE':
        return 'dept3';
        case 'Mech':
        return 'dept4';
        case 'MCA':
        return 'dept5';
      default:
        return '';
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
            {activeTab === 'admin' && (
              <form onSubmit={handleSubmit} className={styles.adminForm}>
                <h1>Create Admin</h1>
                <table className={styles.adminFormTable}>
                  <tbody>
                    <tr className={styles.adminFormRow}>
                      <td>
                        <label>
                          First Name*:
                          <input type="text" name="admin_fname" placeholder='Enter your first name' />
                        </label>
                      </td>
                      <td>
                        <label>
                          Middle Name*:
                          <input type="text" name="admin_mname" placeholder='Enter your middle name'/>
                        </label>
                      </td>
                      <td>
                        <label>
                          Last Name*:
                          <input type="text" name="admin_lname" placeholder='Enter your last name'/>
                        </label>
                      </td>
                    </tr>
                    <tr className={styles.adminFormRow}>
                      <td>
                        <label className={styles.adminEmail}>
                          Email*:
                          <input type="text" name="email" placeholder='Enter your email address' />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <button type="submit">Create Admin Profile</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            )}
            {activeTab === 'mentor' && (
              <form onSubmit={handleSubmit} className={styles.adminForm}>
                <h1>Create Mentor</h1>
                <table className={styles.adminFormTable}>
                  <tbody>
                    <tr className={styles.adminFormRow}>
                      <td>
                        <label>
                          First Name:
                          <input type="text" name="first_name" placeholder='Enter your first name'/>
                        </label>
                      </td>
                      <td>
                        <label>
                          Middle Name:
                          <input type="text" name="middle_name" placeholder='Enter your middle name'/>
                        </label>
                      </td>
                      <td>
                        <label>
                          Last Name:
                          <input type="text" name="last_name" placeholder='Enter your last name'/>
                        </label>
                      </td>
                    </tr>
                    <tr className={styles.adminFormRow}>
                      <td>
                        <label>
                          Qualification:
                          <input type="text" name="qualification" placeholder='Enter your qualification' />
                        </label>
                      </td>
                      <td>
                      <label>
                        Department:
                          <select name="dept_id">
                            <option value="none" disabled selected>None</option>
                            <option value="CS">CS</option>
                            <option value="EEE">EEE</option>
                            <option value="ECE">ECE</option>
                            <option value="Mech">Mech</option>
                            <option value="MCA">MCA</option>
                          </select>
                        </label>

                      </td>
                      <td>
                        <label className={styles.adminEmail}>
                          Email:
                          <input type="text" name="email" placeholder='Enter your email address' />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <button type="submit">Create Mentor Profile</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            )}
            {activeTab === 'student' && (
              <form onSubmit={handleSubmit} className={styles.adminForm}>
                <h1>Create Student</h1>
                <table className={styles.adminFormTable}>
                  <tbody>
                    <tr className={styles.adminFormRow}>
                      <td>
                        <label>
                          First Name:
                          <input type="text" name="first_name" placeholder='Enter yur first name'/>
                        </label>
                      </td>
                      <td>
                        <label>
                          Middle Name:
                          <input type="text" name="middle_name" placeholder='Enter your middle name'/>
                        </label>
                      </td>
                      <td>
                        <label>
                          Last Name:
                          <input type="text" name="last_name" placeholder='Enter your last name'/>
                        </label>
                      </td>
                    </tr>
                    <tr className={styles.adminFormRow}>
                      <td className={styles.adminfalfColumn}>
                        <label className={styles.adminHalf}>
                          Sex:
                          <select name="sex">
                          <option value="none" disabled selected>None</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </label>
                        <label className={styles.adminHalf}>
                          Semester:
                          <select name="semester">
                          <option value="none" disabled selected>None</option>
                            {[...Array(8)].map((_, index) => (
                              <option key={index + 1} value={index + 1}>{index + 1}</option>
                            ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          Student Phone Number:
                          <input type="text" name="student_phone_no" placeholder='Enter your phone number'/>
                        </label>
                      </td>
                      <td>
                        <label className={styles.adminEmail}>
                          Email:
                          <input type="text" name="email" placeholder='Enter your email address'/>
                        </label>
                      </td>
                    </tr>
                    <tr className={styles.adminFormRow}>
                      <td>
                        <label>
                          Date of Birth:
                          <input type="date" name="dob" />
                        </label>
                      </td>
                      <td colSpan={2}>
                        <label className={styles.adminAddress}>
                          Address:
                          <textarea name="address" rows="4" placeholder='Enter your address' />
                        </label>
                      </td>
                    </tr>
                    <tr className={styles.adminFormRow}>
                      <td>
                        <label>
                          Department:
                          <select name="dept_id">
                          <option value="none" disabled selected>None</option>
                            <option value="CS">CS</option>
                            <option value="EEE">EEE</option>
                            <option value="ECE">ECE</option>
                            <option value="Mech">Mech</option>
                            <option value="MCA">MCA</option>

                          </select>
                        </label>
                      </td>
                      <td colSpan="1">
                        <label>
                          Guardian Name:
                          <input type="text" name="guardian_name" placeholder='Enter your guardian'/>
                        </label>
                      </td>
                      <td colSpan="1">
                        <label>
                          Guardian Phone Number:
                          <input type="text" name="guardian_phone_no" placeholder='Guardian phone number'/>
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <button type="submit">Create Student Profile</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            )}
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default AddUser;

