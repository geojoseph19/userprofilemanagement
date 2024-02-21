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
        console.error('Error fetching student data:', error);
        // Redirect to login page if there's an error fetching admin data
        navigate('/'); // Redirect to login page
      } 
    };

    fetchStudentData(); // Call the fetchStudentData function when the component mounts
  }, [navigate]); // Include navigate in dependencies array

  return (
    <>
      {studentData ? (
         
         <div class="main">
         <h2>Outer Div</h2>
         <p>This is the outer div.</p>
         <div class="info">
         <div className='profile-pic-container'>
              <img className='.profile-pic' src='https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg'/>
          </div>
          <div className='info1'>
          <h2><strong>{studentData.first_name} {studentData.middle_name} {studentData.last_name}</strong></h2>
          <p>Student</p>

          </div>
         </div>
       </div>
       
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
}

export default StudentHome;



