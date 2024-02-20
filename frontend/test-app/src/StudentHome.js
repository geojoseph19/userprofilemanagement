import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './AdminHome.css'; 
import axios from 'axios'; 
axios.defaults.withCredentials = true;

function StudentHome() {
  const [studentData, setStudentData] = useState(null); // Changed variable name to studentData
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Function to fetch student home data
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/student/home');
        setStudentData(response.data.response); // Update to set the response data
      } catch (error) {
        console.error('Error fetching student data:', error);
        // Redirect to login page if there's an error fetching student data
        navigate('/'); // Redirect to login page
      } 
    };

    fetchStudentData(); // Call the fetchStudentData function when the component mounts
  }, [navigate]); // Include navigate in dependencies array

  return (
    <div className="second-page-container">
      {studentData ? (
        <div>
          <h2>Student Home</h2>
          <p>Username: {studentData.username}</p>
          <p>First Name: {studentData.first_name}</p>
          <p>Middle Name: {studentData.middle_name}</p>
          <p>Last Name: {studentData.last_name}</p>
          <p>Email ID: {studentData.email_id}</p>
          <p>Department: {studentData.department}</p>
          <p>Address: {studentData.address}</p>
          <p>Guardian Name: {studentData.guardian_name}</p>
          <p>Guardian Phone No: {studentData.guardian_phone_no || 'N/A'}</p>
          <p>Semester: {studentData.semester}</p>
          <p>Sex: {studentData.sex}</p>
          <p>Student Phone No: {studentData.student_phone_no}</p>
        </div>
      ) : (
        <p>Loading student home data...</p>
      )}
    </div>
  );
}

export default StudentHome;
