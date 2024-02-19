import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './MentorHome.css'; 
import axios from 'axios'; 
axios.defaults.withCredentials = true;

function MentorHome() {
  const [mentorData, setMentorData] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Function to fetch admin home data
    const fetchMentorData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/mentor/home');
        setMentorData(response.data.response); // Update to set the response data
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Redirect to login page if there's an error fetching admin data
        navigate('/'); // Redirect to login page
      } 
    };

    fetchMentorData(); // Call the fetchMentorData function when the component mounts
  }, [navigate]); // Include navigate in dependencies array

  return (
    <div className="second-page-container">
      {mentorData ? (
        <div>
          <h2>Mentor Home</h2>
          <p>Username : {mentorData.username}</p>
          <p>Name : {mentorData.first_name} {mentorData.middle_name} {mentorData.last_name}</p>
          <p>Department : {mentorData.department}</p>
          <p>Qualification : {mentorData.qualification}</p>
          <p>Email ID : {mentorData.email}</p>
        </div>
      ) : (
        <p>Loading admin home data...</p>
      )}
    </div>
  );
}

export default MentorHome;



