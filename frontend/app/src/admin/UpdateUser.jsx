import React, { useState } from 'react';
import styles from './UpdateUser.module.css';
import axios from 'axios';
 
const UpdateUser = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Admin Field States
  const [adminFNameChecked, setAdminFNameChecked] = useState(false);
  const [adminMNameChecked, setAdminMNameChecked] = useState(false);
  const [adminLNameChecked, setAdminLNameChecked] = useState(false);
  const [adminEmailChecked, setAdminEmailChecked] = useState(false);
 
  // Mentor Field States
  const [mentorFNameChecked, setMentorFNameChecked] = useState(false);
  const [mentorMNameChecked, setMentorMNameChecked] = useState(false);
  const [mentorLNameChecked, setMentorLNameChecked] = useState(false);
  const [mentorQualificationChecked, setMentorQualificationChecked] = useState(false);
  const [mentorDeptChecked, setMentorDeptChecked] = useState(false);
  const [mentorEmailChecked, setMentorEmailChecked] = useState(false);
 
  // Student Field States
  const [studentFNameChecked, setStudentFNameChecked] = useState(false);
  const [studentMNameChecked, setStudentMNameChecked] = useState(false);
  const [studentLNameChecked, setStudentLNameChecked] = useState(false);
  const [studentSexChecked, setStudentSexChecked] = useState(false);
  const [studentPhoneChecked, setStudentPhoneChecked] = useState(false);
  const [studentEmailChecked, setStudentEmailChecked] = useState(false);
  const [studentAddressChecked, setStudentAddressChecked] = useState(false);
  const [studentDOBChecked, setStudentDOBChecked] = useState(false);
  const [studentDeptChecked, setStudentDeptChecked] = useState(false);
  const [studentSemesterChecked, setStudentSemesterChecked] = useState(false);
  const [studentGuardianNameChecked, setStudentGuardianNameChecked] = useState(false);
  const [studentGuardianPhoneChecked, setStudentGuardianPhoneChecked] = useState(false);
 
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let formData = {
        username: event.target.elements.username.value,
      };
 
      if (activeTab === 'admin') {
        formData = {
          ...formData,
          role_type: 'admin',
          first_name: event.target.elements.admin_fname.value,
          middle_name: event.target.elements.admin_mname.value,
          last_name: event.target.elements.admin_lname.value,
          email: event.target.elements.email.value,
        };
      } else if (activeTab === 'mentor') {
        formData = {
          ...formData,
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
          ...formData,
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
                <h1>Update Admin</h1>
                <table className={styles.adminFormTable}>
  <tbody>
    <tr className={styles.adminFormRow}>
      <td>
        <label>
          Username*:
          <input type="text" name="username" placeholder='Enter your username' />
        </label>
      </td>
    </tr>
    {/* Admin Form Fields */}
    <tr className={styles.adminFormRow}>
      <td>
      <label>
          First Name*:
        </label>
        <input type="text" name="admin_fname" placeholder='Enter your first name' disabled={!adminFNameChecked} onChange={() => setAdminFNameChecked(!adminFNameChecked)} />
      </td>
      <td>
      <input type="checkbox" className={styles.check} checked={adminFNameChecked} onChange={() => setAdminFNameChecked(!adminFNameChecked)} />
 
      </td>
    </tr>
    <tr className={styles.adminFormRow}>
      <td>
      <label>
          Middle Name*:
        </label>
        <input type="text" name="admin_mname" placeholder='Enter your middle name' disabled={!adminMNameChecked} onChange={() => setAdminMNameChecked(!adminMNameChecked)} />
      </td>
      <td>
      <input type="checkbox" className={styles.check} checked={adminMNameChecked} onChange={() => setAdminMNameChecked(!adminMNameChecked)} />
      </td>
    </tr>
    <tr className={styles.adminFormRow}>
      <td>
      <label>
          Last Name*:
        </label>
        <input type="text" name="admin_lname" placeholder='Enter your last name' disabled={!adminLNameChecked} onChange={() => setAdminLNameChecked(!adminLNameChecked)} />
      </td>
      <td>
      <input type="checkbox" className={styles.check} checked={adminLNameChecked} onChange={() => setAdminLNameChecked(!adminLNameChecked)} />
 
      </td>
    </tr>
    <tr className={styles.adminFormRow}>
      <td>
      <label>
          Email*:
        </label>
        <input type="text" name="email" placeholder='Enter your email address' disabled={!adminEmailChecked} onChange={() => setAdminEmailChecked(!adminEmailChecked)} />
      </td>
      <td>
      <input type="checkbox" className={styles.check} checked={adminEmailChecked} onChange={() => setAdminEmailChecked(!adminEmailChecked)} />
 
      </td>
    </tr>
    <tr>
      <td colSpan="2">
        <button type="submit">Update Admin Profile</button>
      </td>
    </tr>
  </tbody>
</table>
 
              </form>
            )}
            {activeTab === 'mentor' && (
  <form onSubmit={handleSubmit} className={styles.adminForm}>
    <h1>Update Mentor</h1>
    <table className={styles.adminFormTable}>
      <tbody>
        {/* Username Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Username*:
              <input type="text" name="username" placeholder="Enter your username" />
            </label>
          </td>
        </tr>
        {/* First Name Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              First Name:
              <input type="text" name="first_name" placeholder="Enter your first name" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={mentorFNameChecked}
              onChange={() => setMentorFNameChecked(!mentorFNameChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Middle Name Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Middle Name:
              <input type="text" name="middle_name" placeholder="Enter your middle name" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={mentorMNameChecked}
              onChange={() => setMentorMNameChecked(!mentorMNameChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Last Name Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Last Name:
              <input type="text" name="last_name" placeholder="Enter your last name" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={mentorLNameChecked}
              onChange={() => setMentorLNameChecked(!mentorLNameChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Qualification Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Qualification:
              <input type="text" name="qualification" placeholder="Enter your qualification" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={mentorQualificationChecked}
              onChange={() => setMentorQualificationChecked(!mentorQualificationChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Department Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Department:
              <select name="dept_id">
                <option value="none" disabled selected>
                  None
                </option>
                <option value="CS">CS</option>
                <option value="EEE">EEE</option>
                <option value="ECE">ECE</option>
                <option value="Mech">Mech</option>
                <option value="MCA">MCA</option>
              </select>
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={mentorDeptChecked}
              onChange={() => setMentorDeptChecked(!mentorDeptChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Email Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Email:
              <input type="text" name="email" placeholder="Enter your email address" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={mentorEmailChecked}
              onChange={() => setMentorEmailChecked(!mentorEmailChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Submit Button */}
        <tr>
          <td colSpan="2">
            <button type="submit">Update Mentor Profile</button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
)}
 
{activeTab === 'student' && (
  <form onSubmit={handleSubmit} className={styles.adminForm}>
    <h1>Update Student</h1>
    <table className={styles.adminFormTable}>
      <tbody>
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Username*:
              <input type="text" name="username" placeholder="Enter your username" />
            </label>
          </td>
        </tr>
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                placeholder="Enter your first name"
                disabled={!studentFNameChecked}
                onChange={() => setStudentFNameChecked(!studentFNameChecked)}
              />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentFNameChecked}
              onChange={() => setStudentFNameChecked(!studentFNameChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Middle Name:
              <input
                type="text"
                name="middle_name"
                placeholder="Enter your middle name"
                disabled={!studentMNameChecked}
                onChange={() => setStudentMNameChecked(!studentMNameChecked)}
              />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentMNameChecked}
              onChange={() => setStudentMNameChecked(!studentMNameChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Last Name:
              <input
                type="text"
                name="last_name"
                placeholder="Enter your last name"
                disabled={!studentLNameChecked}
                onChange={() => setStudentLNameChecked(!studentLNameChecked)}
              />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentLNameChecked}
              onChange={() => setStudentLNameChecked(!studentLNameChecked)}
            />{' '}
            Enable
          </td>
        </tr>
 
        {/* Sex Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Sex:
              <select name="sex">
                <option value="none" disabled={!setStudentSexChecked} onChange={() => setStudentSexChecked(!studentSexChecked)}>
                  None
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentSexChecked}
              onChange={() => setStudentSexChecked(!studentSexChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Student Phone Number Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Student Phone Number:
              <input type="text" name="student_phone_no" placeholder="Enter your phone number" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentPhoneChecked}
              onChange={() => setStudentPhoneChecked(!studentPhoneChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Email Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Email:
              <input type="text" name="email" placeholder="Enter your email address" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentEmailChecked}
              onChange={() => setStudentEmailChecked(!studentEmailChecked)}
            />{' '}
          </td>
        </tr>
        {/* Address Field */}
        <tr className={styles.adminFormRow}>
  <td colSpan="2">
    <label>
      Address:
      <textarea name="address" rows="4" placeholder="Enter your address" />
    </label>
  </td>
</tr>
<tr className={styles.adminFormRow}>
  <td>
    <input
      type="checkbox"
      checked={studentAddressChecked}
      onChange={() => setStudentAddressChecked(!studentAddressChecked)}
    />{' '}
    Enable
  </td>
</tr>
        {/* Date of Birth Field */}
        <tr className={styles.adminFormRow}>
  <td>
    <label>
      Date of Birth:
      <input
        type="date"
        name="dob"
        disabled={!studentDOBChecked}
        onChange={() => setStudentDOBChecked(!studentDOBChecked)}
      />
    </label>
  </td>
  <td>
    <input
      type="checkbox"
      checked={studentDOBChecked}
      onChange={() => setStudentDOBChecked(!studentDOBChecked)}
    />{' '}
    Enable
  </td>
</tr>
        {/* Department Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Department:
              <select name="dept_id">
                <option value="none" disabled selected>
                  None
                </option>
                <option value="CS">CS</option>
                <option value="EEE">EEE</option>
                <option value="ECE">ECE</option>
                <option value="Mech">Mech</option>
                <option value="MCA">MCA</option>
              </select>
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentDeptChecked}
              onChange={() => setStudentDeptChecked(!studentDeptChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Semester Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Semester:
              <select name="semester">
                <option value="none" disabled selected>
                  None
                </option>
                {[...Array(8)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentSemesterChecked}
              onChange={() => setStudentSemesterChecked(!studentSemesterChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Guardian Name Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Guardian Name:
              <input type="text" name="guardian_name" placeholder="Enter your guardian" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentGuardianNameChecked}
              onChange={() => setStudentGuardianNameChecked(!studentGuardianNameChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Guardian Phone Number Field */}
        <tr className={styles.adminFormRow}>
          <td>
            <label>
              Guardian Phone Number:
              <input type="text" name="guardian_phone_no" placeholder="Guardian phone number" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              checked={studentGuardianPhoneChecked}
              onChange={() => setStudentGuardianPhoneChecked(!studentGuardianPhoneChecked)}
            />{' '}
            Enable
          </td>
        </tr>
        {/* Submit Button */}
        <tr>
          <td colSpan="2">
            <button type="submit">Update Student Profile</button>
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
 
export default UpdateUser;
 