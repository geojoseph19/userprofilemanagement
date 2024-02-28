import React, { useContext, useEffect, useState } from "react";
import { SharedUserContext } from "../UserContextShare";
import styles from './MentorProjects.module.css'

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
    <div className={styles.mainContainer}>
      <h1>Projects</h1>
      <div className={styles.infoContainer}>
        
        <div className={styles['mentor-project-card']}>
        <span class="material-symbols-outlined" style={{color:'grey',fontSize:'600%'}}>add</span>
        </div>

        
      </div>
    </div>
  
  );
}

export default MentorProfile;
