import React, { useContext, useEffect, useState } from "react";
import { SharedUserContext } from "../UserContextShare";
import styles from './Profile.module.css'

const MentorProfile = () => {
  const { sharedUserData } = useContext(SharedUserContext);
  const [studentData, setStudentData] = useState(sharedUserData);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setStudentData(JSON.parse(storedData));
    }
  }, []);

  return (
    <>
    <div className={styles.mainContainer}>
      <h1>My Profile</h1>
      <div className={styles.infoContainer}>
        <h3>Personal Details</h3>
        <hr />
        <div className={styles.details}>
          {studentData && (
            <div className="profileData">
              <table>
              <tbody>
                <tr>
                  <td><strong>Username</strong></td>
                  <td>:</td>
                  <td>{studentData.username}</td>
                </tr>
                <tr>
                  <td><strong>Full Name</strong></td>
                  <td>:</td>
                  <td>{`${studentData.first_name} ${studentData.middle_name} ${studentData.last_name}`}</td>
                </tr>
                <tr>
                  <td><strong>Department</strong></td>
                  <td>:</td>
                  <td>{studentData.department}</td>
                </tr>
                <tr>
                  <td><strong>Qualification</strong></td>
                  <td>:</td>
                  <td>{studentData.qualification}</td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>:</td>
                  <td>{studentData.email}</td>
                </tr>
               
                
                {/* Add more student details as needed */}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  
  );
}

export default MentorProfile;
