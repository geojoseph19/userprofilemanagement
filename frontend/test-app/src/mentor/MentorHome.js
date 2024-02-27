import React, { useState, useEffect, useContext } from "react";
import { SharedUserContext } from '../UserContextShare';

import { json, useNavigate } from "react-router-dom";
import styles from "./Mentor.module.css";
import axios from "axios";
axios.defaults.withCredentials = true;


function MentorHome() {
  const [mentorData, setMentorData] = useState(null);
  const navigate = useNavigate();
  const { setSharedUserData } = useContext(SharedUserContext);

  useEffect(() => {
    const fetchMentorData = async () => {

      try {
        const rawstoredData = localStorage.getItem('userData');
        const rawloggedUsername = localStorage.getItem('username');
        const rawloggedUserRole = localStorage.getItem('userRole');

        const storedData = JSON.parse(rawstoredData);
        const loggedUsername = JSON.parse(rawloggedUsername);
        const loggedUserRole = JSON.parse(rawloggedUserRole);

        if (loggedUserRole === 'mentor'){
          if(storedData){
            if(storedData.username === loggedUsername){
              setMentorData(storedData);
              setSharedUserData(storedData);

            }else{
              // 404 unauthorized
              window.location.href = '/';
            }
          }else{
            const response = await axios.get("http://127.0.0.1:5000/api/v1/mentor/home");
            const responseData = response.data.response;
            setMentorData(responseData);
            localStorage.setItem('userData', JSON.stringify(responseData));
            setSharedUserData(responseData);
          }
        }else{

          // 404 unauthorized
          window.location.href = '/';
        }
        
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        navigate("/");
      }
    };

    fetchMentorData();
  }, [navigate, setSharedUserData]);

  return (
    <>
      {mentorData ? (
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
                  {mentorData.first_name} {mentorData.middle_name}{" "}
                  {mentorData.last_name}
                </strong>
              </h2>
              <p>Mentor</p>
            </div>

            {/* Basic mentor Details */}
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
                  <td>{mentorData.username}</td>
                </tr>
               
                <tr>
                  <td><strong>Department</strong></td>
                  <td>:</td>
                  <td>{mentorData.department}</td>
                </tr>
                <tr>
                  <td><strong>Qualification</strong></td>
                  <td>:</td>
                  <td>{mentorData.qualification}</td>
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

export default MentorHome;
