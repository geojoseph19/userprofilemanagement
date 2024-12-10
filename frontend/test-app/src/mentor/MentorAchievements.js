import React, { useState } from "react";
import axios from "axios";
import styles from './MentorAchievements.module.css';
import adminStyles from '../admin/AddUser/AddUser.module.css';

const MentorAchievements = () => {
  const [studentId, setStudentId] = useState("");
  const [achievementId, setAchievementId] = useState("");

  const handleAddAchievement = () => {
    // Call the endpoint to add achievement
    axios.post('http://127.0.0.1:5000/api/v1/mentor/addAchievement', {
      student_id: studentId,
      achievement_id: achievementId
    })
    .then(response => {
      // Handle success if needed
      console.log("Achievement added successfully!");
    })
    .catch(error => {
      // Handle error if needed
      console.error('Error adding achievement:', error);
    });

    // Clear input fields after adding achievement
    setStudentId("");
    setAchievementId("");
  };

  return (
    <div className={styles.mainContainer}>
      <h1>Achievements</h1>
      <div className={styles.infoContainer}>
        <label htmlFor="studentId">Student ID:</label>
        <input
          type="text"
          id="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="achievementId">Achievement ID:</label>
        <input
          type="text"
          id="achievementId"
          value={achievementId}
          onChange={(e) => setAchievementId(e.target.value)}
        />
      </div>
      <button className={styles['mentor-btn']} onClick={handleAddAchievement}>Add Achievement</button>
    </div>
  );
};

export default MentorAchievements;
