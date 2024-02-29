import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EditProfile.module.css'; 

const EditProfile = () => {
  const [formData, setFormData] = useState(null); // State to store form data

  useEffect(() => {
    // Retrieve data from local storage
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to update user data
      const response = await axios.put('http://127.0.0.1:5000/api/v1/student/editProfile', formData);
      console.log(response.data);
      // Update local storage with the new form data
      localStorage.setItem('userData', JSON.stringify(formData));
      alert("User details updated!");
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  

  return (
    <div className={styles.Main}>
      <div className={styles.pageTitle}><h1>Edit profile</h1></div>
      <div className={styles.info}>
        {/* Render form only if formData is available */}
        {formData && (
          <form onSubmit={handleSubmit}>
            {/* Map through formData keys to render input fields */}
            {Object.keys(formData).map(key => (
              <div key={key}>
                <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</label>
                <input type="text" id={key} name={key} value={formData[key]} onChange={handleChange} />
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
