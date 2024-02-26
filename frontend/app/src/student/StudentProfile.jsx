import React, { useContext, useEffect, useState } from "react";
import { SharedStudentContext } from "../StudentContextShare";
import styles from './Profile.module.css'

const StudentProfile = () => {
  const { sharedStudentData } = useContext(SharedStudentContext);
  const [studentData, setStudentData] = useState(sharedStudentData);

  useEffect(() => {
    const storedData = localStorage.getItem('studentData');
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
                  <td><strong>Semester</strong></td>
                  <td>:</td>
                  <td>{studentData.semester}</td>
                </tr>
                <tr>
                  <td><strong>Gender</strong></td>
                  <td>:</td>
                  <td>{studentData.sex}</td>
                </tr>
                <tr>
                  <td><strong>Permanent Address</strong></td>
                  <td>:</td>
                  <td>
                    {studentData.address &&
                      studentData.address.split(',').map((line, index) => (
                        <span key={index}>{line.trim()+' ,'}</span>
                      ))}
                  </td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>:</td>
                  <td>{studentData.email_id}</td>
                </tr>
                <tr>
                  <td><strong>Phone</strong></td>
                  <td>:</td>
                  <td>{studentData.student_phone_no}</td>
                </tr>
                <tr>
                  <td><strong>Guardian</strong></td>
                  <td>:</td>
                  <td>{studentData.guardian_name}</td>
                </tr>
                <tr>
                  <td><strong>Guardian Phone</strong></td>
                  <td>:</td>
                  <td>{studentData.guardian_phone_no}</td>
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

export default StudentProfile;
