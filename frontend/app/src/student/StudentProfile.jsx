import React, { useContext, useEffect, useState } from "react";
import { SharedUserContext } from "../UserContextShare";
import styles from './Profile.module.css'

 
const StudentProfile = () => {
  const { sharedUserData } = useContext(SharedUserContext);
  const [studentData, setStudentData] = useState(sharedUserData);

  const toEditProfile=()=>{
    window.location.href='/edit-profile'
  }
 
  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setStudentData(JSON.parse(storedData));
    }
  }, []);
 
  return (
    <>
    <div className={styles.Main}>
      <h1>My Profile</h1>
      <div className={styles.info}>
        <div className={styles.infoheader}>
        <h3>Personal Details</h3>
        
       <button type="submit" className={styles.editButton} onClick={toEditProfile}>Edit Profile</button>
        
        </div>
        <hr />
        <div className={styles.details}>
          {studentData && (
            <div>
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
                    {studentData.address && typeof studentData.address === 'object' ? (
                      <div>{`${studentData.address.address_line}, ${studentData.address.city}, ${studentData.address.state}, ${studentData.address.country}, PIN: ${studentData.address.pincode}`}</div>
                    ) : (
                      <div>{studentData.address}</div>
                    )}
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
 