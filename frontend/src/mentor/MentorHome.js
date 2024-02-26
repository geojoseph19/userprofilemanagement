import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Mentor.css'; 
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
    <div className="infoContainer">
    {mentorData ? (
      <div className='container'>  
      <div className='data_panel'>
        <div className='panelTop'>
          <div className='profile-pic-container'>
            <img className='.profile-pic' src='https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg'/>
          </div>
        </div>
        
          <div className='userInfo'>
          <h2><u>Student Profile</u></h2>
            <p><strong>Username </strong>: {mentorData.username}</p>
            <p><strong>Name</strong> : {mentorData.first_name} {mentorData.middle_name} {mentorData.last_name}</p>
            <p><strong>Department</strong>: {mentorData.department}</p>
            <p><strong>Semester</strong> : {mentorData.semester}</p>
          </div>
        
       
        
      </div>

      </div>
    ) : (
      <p>Loading data...</p>
    )}
  </div>
  );
}

export default MentorHome;



