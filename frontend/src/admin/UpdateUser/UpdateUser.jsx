import React, { useState } from 'react';
import styles from './UpdateUser.module.css'; // Import CSS module

const UpdateUser = () => {
    // AddUser.js

  const [activeTab, setActiveTab] = useState('admin');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className={styles.main}>
      <div className={styles.info}>
        <div className={styles.tabs}>
          <button onClick={() => handleTabChange('admin')} className={activeTab === 'admin' ? styles.active : ''}>Admin</button>
          <button onClick={() => handleTabChange('mentor')} className={activeTab === 'mentor' ? styles.active : ''}>Mentor</button>
          <button onClick={() => handleTabChange('student')} className={activeTab === 'student' ? styles.active : ''}>Student</button>
        </div>
        <div className={styles.scrollableContent}>
          <div className={styles.tabContent}>
            {activeTab === 'admin' && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h1>Update Admin</h1>
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
            {activeTab === 'mentor' && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h1>Update Mentor</h1>
                <table className={styles.formTable}>
                <tbody>
<tr className={styles.formRow}>
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
<tr className={styles.formRow}>
  <td>
    <label className={styles.email}>
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
  <td colSpan="1">
    <label>
      Qualifiation:
      <input type="text" name="qualification" />
    </label>
  </td>
</tr>
<tr className={styles.formRow}>
  
</tr>
<tr className={styles.formRow}> 
 
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
              <h1>Update Student</h1>
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
      <input type="text" name="guardian_phone_no" />
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

export default UpdateUser;
