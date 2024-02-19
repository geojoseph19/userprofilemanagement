import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate 
import './Student.css'; 
import axios from 'axios'; 
axios.defaults.withCredentials = true;

function StudentHome() {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Function to fetch admin home data
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/student/home');
        setStudentData(response.data.response); // Update to set the response data
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Redirect to login page if there's an error fetching admin data
        navigate('/'); // Redirect to login page
      } 
    };

    fetchStudentData(); // Call the fetchStudentData function when the component mounts
  }, [navigate]); // Include navigate in dependencies array

  return (
    <div className="infoContainer">
      {studentData ? (
        <div className='container'>  
        <div className='data_panel'>
          <div className='panelTop'>
            <div className='profile-pic'>
              <img src=''/>
            </div>
          </div>
          
            <div className='userInfo'>
            <h2><u>Student Profile</u></h2>
              <p><strong>Username </strong>: {studentData.username}</p>
              <p><strong>Name</strong> : {studentData.first_name} {studentData.middle_name} {studentData.last_name}</p>
              <p><strong>Department</strong>: {studentData.department}</p>
              <p><strong>Semester</strong> : {studentData.semester}</p>
            </div>
          
         
          
        </div>

        </div>
      ) : (
        <p>Loading admin home data...</p>
      )}
    </div>
  );
}

export default StudentHome;



