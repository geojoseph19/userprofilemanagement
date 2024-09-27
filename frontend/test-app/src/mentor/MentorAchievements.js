import React, { useState } from "react";
import axios from "axios";
import styles from './MentorAchievements.module.css';
import { toast, ToastContainer } from 'react-toastify';

const MentorAchievements = () => {
  const [studentId, setStudentId] = useState("");
  const [achievementId, setAchievementId] = useState("");
  const [activeTab, setActiveTab] = useState('add');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAction = () => {
    if (activeTab === 'add') {
      handleAddAchievement();
    } else {
      handleRemoveAchievement();
    }
  };

  const handleAddAchievement = () => {
    // Call the endpoint to add achievement
    axios.post('http://127.0.0.1:5000/api/v1/mentor/addAchievement', {
      student_id: studentId,
      achievement_id: achievementId
    })
    .then(response => {
      // Handle success if needed
      // Clear input fields after adding achievement
        setStudentId("");
        setAchievementId("");
      toast.success("Achievement added successfully",{ autoClose : 5000});
    })
    .catch(error => {
      // Handle error if needed
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error, { autoClose : 5000});
      } else {
        toast.error("Error adding achievement", { autoClose : 5000});
      }
    });

    
  };

  const handleRemoveAchievement = () => {
    // Call the endpoint to remove achievement
    axios.post('http://127.0.0.1:5000/api/v1/mentor/removeAchievement', {
      student_id: studentId,
      achievement_id: achievementId
    })
    .then(response => {
       // Clear input fields after removing achievement
    setStudentId("");
    setAchievementId("");
      toast.success("Achievement removed successfully",{ autoClose : 5000});
    })
    .catch(error => {
      // Handle error if needed
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error, { autoClose : 5000});
      } else {
        toast.error("Error removing achievement", { autoClose : 5000});
      }
    });

   
  };

  return (
    <div className={styles.mainContainer}>
      <h1>Achievements</h1>
     
      <div className={styles['ach-infoContainer']}>
        <div className={styles.adminTabs}>
          <button onClick={() => handleTabChange('add')} className={`${styles.adminButton} ${activeTab === 'add' ? styles.active : ''}`}>Add</button>
          <button  onClick={() => handleTabChange('remove')} className={`${styles.adminButton} ${activeTab === 'remove' ? styles.active : ''}`}>Remove</button>
        </div>
        <div className={styles.addach}>
          <h3>{activeTab === 'add' ? "Add Achievement" : "Remove Achievement"}</h3>
          <label className={styles['adminLabel']} htmlFor="studentId">Student ID:</label>
          <input
            className={styles['mentor-input']}
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <label className={styles['adminLabel']} htmlFor="achievementId">Achievement ID:</label>
          <input
            type="text"
            id="achievementId"
            value={achievementId}
            onChange={(e) => setAchievementId(e.target.value)}
          />
          <button className={styles['mentor-btn'] } onClick={handleAction}>
            {activeTab === 'add' ? "Add Achievement" : "Remove Achievement"}
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default MentorAchievements;
