// EditProfile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EditProfile.module.css'; 

const EditProfile = ({ formData, setFormData, fieldOrder, role }) => {
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Real-time validation
    const newErrors = { ...errors };
    if (name === 'student_phone_no' && !/^\d{10}$/.test(value)) {
      newErrors.student_phone_no = 'Invalid phone number';
    } else if (name === 'mentor_phone_no' && !/^\d{10}$/.test(value)) {
      newErrors.mentor_phone_no = 'Invalid phone number';
    } else if (name === 'email_id' && !/\S+@\S+\.\S+/.test(value)) {
      newErrors.email_id = 'Invalid email address';
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.put(`http://127.0.0.1:5000/api/v1/${role.replace(/"/g, '')}/editProfile`, formData);

        console.log(response.data);
        localStorage.setItem('userData', JSON.stringify(formData));
        alert("User details updated!");
        console.log('The user is a ',role)
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (role === 'student') {
      if (!/^\d{10}$/.test(formData.student_phone_no)) {
        newErrors.student_phone_no = 'Invalid phone number';
      }
    } else if (role === 'mentor') {
      if (!/^\d{10}$/.test(formData.mentor_phone_no)) {
        newErrors.mentor_phone_no = 'Invalid phone number';
      }
    }
    if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
      newErrors.email_id = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className={styles.Main}>
      <div className={styles.pageTitle}><h1>Edit profile</h1></div>
      <div className={styles.info}>
        {formData && (
          <form onSubmit={handleSubmit}>
            {fieldOrder.map(key => (
              <div key={key}>
                <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</label>
                <input type="text" id={key} name={key} value={formData[key]} onChange={handleChange} />
                {errors[key] && <p className={styles.error}>{errors[key]}</p>}
              </div>
            ))}
            <button type="submit">Save Changes</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
