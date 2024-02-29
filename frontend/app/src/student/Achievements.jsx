import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Achievements.module.css';

const StudentAchievements = () => {
  const [achievements, setAchievements] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/student/achievements');
        const achievementsData = response.data.response;

        // Calculate total points
        const pointsArray = Object.values(achievementsData).map(achievement => achievement.points);
        const sumPoints = pointsArray.reduce((acc, curr) => acc + curr, 0);
        setTotalPoints(sumPoints);

        // Set achievements data
        setAchievements(achievementsData);
      } catch (error) {
        console.error('Error fetching Achievements:', error);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div className={styles.Main}>
      <div className={styles.pageTitle}><h1>My Achievements</h1>
      <div className={styles.totalPoints}>
              <h2>Total points</h2>
              <hr />
              <div><strong>{totalPoints}</strong></div>
            </div>
            </div>
      <div className={styles.info}>
        {achievements && (
          <div className={styles.achInfo}>
            <div className={styles.achievements}>
              {Object.entries(achievements).map(([achievementId, achievement]) => (
                <div key={achievementId} className={styles.achievementDetails}>
                  <React.Fragment>
                    <div ><h3>{achievement.achievement_name}</h3></div>
                    <hr />
                    <div >{achievement.description}</div>
                    <hr />
                  </React.Fragment>
                  <div className={styles.points}><strong>Points:</strong> {achievement.points}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAchievements;
