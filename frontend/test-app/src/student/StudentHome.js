import React, { useState, useEffect, useContext } from "react";
import { SharedUserContext } from '../UserContextShare';
import { useNavigate } from "react-router-dom";
import styles from "./Student.module.css";
import axios from "axios";
axios.defaults.withCredentials = true;

function StudentHome() {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();
  const { setSharedUserData, projectDetails } = useContext(SharedUserContext);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const rawstoredData = localStorage.getItem('userData');
        const rawloggedUsername = localStorage.getItem('username');
        const rawloggedUserRole = localStorage.getItem('userRole');

        const storedData = JSON.parse(rawstoredData);
        const loggedUsername = JSON.parse(rawloggedUsername);
        const loggedUserRole = JSON.parse(rawloggedUserRole);

        if (loggedUserRole === 'student') {
          if (storedData) {
            if (storedData.username === loggedUsername) {
              setStudentData(storedData);
              setSharedUserData(storedData);

            } else {
              // 404 unauthorized
              window.location.href = '/';
            }
          } else {
            const response = await axios.get("http://127.0.0.1:5000/api/v1/student/home");
            const responseData = response.data.response;
            setStudentData(responseData);
            localStorage.setItem('userData', JSON.stringify(responseData));
            setSharedUserData(responseData);
          }
        } else {

          // 404 unauthorized
          window.location.href = '/';
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        navigate("/");
      }
    };

    fetchStudentData();
  }, [navigate, setSharedUserData, projectDetails]);

  // Array containing the fields to display
  const fieldsToDisplay = [
    { label: "Username", key: "username" },
    { label: "Department", key: "department" }
    // You can add more fields here if needed in the future
  ];

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
                <hr />
                <table>
                  <tbody>
                    {/* Map over the fieldsToDisplay array */}
                    {fieldsToDisplay.map((field) => (
                      <tr key={field.key}>
                        <td><strong>{field.label}</strong></td>
                        <td>:</td>
                        <td>{studentData[field.key]}</td>
                      </tr>
                    ))}
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
