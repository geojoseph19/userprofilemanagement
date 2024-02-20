import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './AdminHome.css'; 
import axios from 'axios'; 
axios.defaults.withCredentials = true;

function StudentHome() {
  const [userData, setUserData] = useState(null); // Changed variable name to userData
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/mentor/home');
        setUserData(response.data.response); // Update to set the response data
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Redirect to login page if there's an error fetching user data
        navigate('/'); // Redirect to login page
      } 
    };

    fetchUserData(); // Call the fetchUserData function when the component mounts
  }, [navigate]); // Include navigate in dependencies array

  return (
    <div className="second-page-container">
      {userData ? (
        <div>
          <h2>Mentor Home</h2>
          <p>First Name: {userData.first_name}</p>
          <p>Last Name: {userData.last_name}</p>
          <p>Middle Name: {userData.middle_name}</p>
          <p>Email: {userData.email}</p>
          <p>Department: {userData.department}</p>
          {userData.qualification && <p>Qualification: {userData.qualification}</p>}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default StudentHome;
