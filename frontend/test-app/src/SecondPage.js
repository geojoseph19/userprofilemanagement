// SecondPage.js
import React, { useState, useEffect } from 'react';
import './SecondPage.css'; // Import CSS file for SecondPage
import axios from 'axios'; // Import Axios

function SecondPage() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Function to fetch admin home data
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/admin/home');
        setAdminData(response.data.response); // Update to set the response data
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData(); // Call the fetchAdminData function when the component mounts
  }, []);

  return (
    <div className="second-page-container">
      {adminData ? (
        <div>
          <h2>Admin Home Details</h2>
          <p>Username: {adminData.Username}</p>
          <p>First Name: {adminData.First_Name}</p>
          <p>Middle Name: {adminData.Middle_Name}</p>
          <p>Last Name: {adminData.Last_Name}</p>
          <p>Email ID: {adminData.Email_ID}</p>
        </div>
      ) : (
        <p>Loading admin home data...</p>
      )}
      <button onClick={() => window.location.href = '/'}>Go to Home Page</button>
    </div>
  );
}

export default SecondPage;
