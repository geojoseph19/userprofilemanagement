import React, { useState, useEffect, useContext } from "react";
import { SharedStudentContext } from '../StudentContextShare';

import { useNavigate } from "react-router-dom";
import styles from "./Student.module.css";
import axios from "axios";
axios.defaults.withCredentials = true;


function StudentHome() {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();
  const { setSharedStudentData } = useContext(SharedStudentContext);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const storedData = localStorage.getItem('studentData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setStudentData(parsedData);
          setSharedStudentData(parsedData);
        } else {
          const response = await axios.get("http://127.0.0.1:5000/api/v1/student/home");
          const responseData = response.data.response;
          setStudentData(responseData);
          localStorage.setItem('studentData', JSON.stringify(responseData));
          setSharedStudentData(responseData);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        navigate("/");
      }
    };

    fetchStudentData();
  }, [navigate, setSharedStudentData]);

  return (
    <>
      {studentData ? (
        <div className={styles.Main}>
          <div className={styles.info}>
            <div className={styles.profilePicContainer}>
              <img
                className={styles.profilePic}
                src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                alt=""
              />
            </div>
            <div className={styles.info1}>
              <h2>
                <strong>
                  {studentData.first_name} {studentData.middle_name}{" "}
                  {studentData.last_name}
                </strong>
              </h2>
              <p>Student</p>
            </div>

            {/* Basic Student Details */}
            <div className={styles.basicDetailContainer}>
              <div className={styles.basicDetails}>
                <div className={styles.sectionTitle}>
                  <h2 className={styles.title}>Basic details</h2>
                </div>
                <hr/>
                <table>
              <tbody>
                <tr>
                  <td><strong>Username</strong></td>
                  <td>:</td>
                  <td>{studentData.username}</td>
                </tr>
               
                <tr>
                  <td><strong>Department</strong></td>
                  <td>:</td>
                  <td>{studentData.department}</td>
                </tr>
                <tr>
                  <td><strong>Semester</strong></td>
                  <td>:</td>
                  <td>{studentData.semester}</td>
                </tr>
                
               
                
                {/* Add more student details as needed */}
              </tbody>
            </table>
              </div>
            </div>


              {/* Projects Container */}
            
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
}

export default StudentHome;
