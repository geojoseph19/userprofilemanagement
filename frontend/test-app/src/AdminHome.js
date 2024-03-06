import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './AdminHome.css'; 
import axios from 'axios'; 
axios.defaults.withCredentials = true;

function AdminHome() {
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Function to fetch admin home data
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/admin/home');
        setAdminData(response.data.response); // Update to set the response data
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Redirect to login page if there's an error fetching admin data
        navigate('/'); // Redirect to login page
      } 
    };

    fetchAdminData(); // Call the fetchAdminData function when the component mounts
  }, [navigate]); // Include navigate in dependencies array

  return (
    <div className="second-page-container">
      {adminData ? (
        <div>
          <h2>Admin Home</h2>
          <p>Username: {adminData.Username}</p>
          <p>First Name: {adminData.First_Name}</p>
          <p>Middle Name: {adminData.Middle_Name}</p>
          <p>Last Name: {adminData.Last_Name}</p>
          <p>Email ID: {adminData.Email_ID}</p>
        </div>
      ) : (
        <p>Loading admin home data...</p>
      )}
    </div>
  );
}

export default AdminHome;



