import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ChangePassword.module.css';
 
const ChangePassword = ({ formData, setFormData, role }) => {
  const [passwordFormData, setPasswordFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_retype: ''
  });
  const [errors, setErrors] = useState({});
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
 
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(`http://127.0.0.1:5000/api/v1/updatepwd`, passwordFormData);
        console.log(response.data);
        toast.success("Password updated successfully!", { autoClose: 5000 });
      } catch (error) {
        console.error('Error! Couldn\'t update password:', error);
        toast.error("Error updating password. Please try again later.", { autoClose: 5000 });
      }
    }
  };
  
 
  const validateForm = () => {
    const newErrors = {};
 
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const lowercaseRegex = /^(?=.*[a-z])/;
    const digitRegex = /^(?=.*\d)/;
    const specialCharRegex = /^(?=.*[!@#$%^&*()-+=])/;
 
    if (!passwordFormData.old_password) {
        newErrors.old_password = 'Old password is required';
    }
 
    if (!passwordFormData.new_password) {
        newErrors.new_password = 'New password is required';
    } else if (
        passwordFormData.new_password.length < 8 ||
        !uppercaseRegex.test(passwordFormData.new_password) ||
        !lowercaseRegex.test(passwordFormData.new_password) ||
        !digitRegex.test(passwordFormData.new_password) ||
        !specialCharRegex.test(passwordFormData.new_password)
    ) {
        newErrors.new_password =
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*()-+=)';
    }
 
    if (!passwordFormData.new_password_retype) {
        newErrors.new_password_retype = 'Please confirm your new password';
    } else if (passwordFormData.new_password !== passwordFormData.new_password_retype) {
        newErrors.new_password_retype = 'Passwords do not match';
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  return (
    <div className={styles.Main}>
      <div className={styles.pageTitle}><h1>Change Password</h1></div>
      <div className={styles.info}>
       <div className={styles.formContainer}>
       <form onSubmit={handleSubmit}>
         <div className={styles.formContents}>
          <div className={styles.formGroup}>
            <label htmlFor="old_password">Old Password</label>
            <input type="password" id="old_password" name="old_password" value={passwordFormData.old_password} onChange={handleChange} />
            {errors.old_password && <p className={styles.error}>{errors.old_password}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="new_password">New Password</label>
            <input type="password" id="new_password" name="new_password" value={passwordFormData.new_password} onChange={handleChange} />
            {errors.new_password && <p className={styles.error}>{errors.new_password}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="new_password_retype">Confirm New Password</label>
            <input type="password" id="new_password_retype" name="new_password_retype" value={passwordFormData.new_password_retype} onChange={handleChange} />
            {errors.new_password_retype && <p className={styles.error}>{errors.new_password_retype}</p>}
          </div>
          <button type="submit">Change Password</button>
         </div>
        </form>
       </div>
      </div>
      <ToastContainer />
      
    </div>
  );
};
 
export default ChangePassword;