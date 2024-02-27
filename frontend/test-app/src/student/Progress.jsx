import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Progress.module.css';
import ProgressRing from './ProgressRing';

const StudentAchievements = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/student/progress');
        const progressData = response.data.response;
        setProgress(progressData);
      } catch (error) {
        console.error('Error fetching Achievements:', error);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div className={styles.Main}>
      <div className="pageTitle"><h1>Course Progress</h1></div>
      <div className={styles.info}>
        {progress && (
          <>
          <div className={styles.wheel}>
            <ProgressRing currentSemester={progress.current_semester} totalSemesters={progress.total_semesters}/>
          </div>
          <div className={styles.progressInfo}>
              {progress.total_semesters && [...Array(progress.total_semesters)].map((_, semesterIndex) => (
                <div key={semesterIndex} className={styles.semester}>
                  <h2>{`Semester ${semesterIndex + 1}`}</h2>
                  <hr />
                  <table>
                    <tbody>
                      {progress.courses_completed.filter(course => course.semester === semesterIndex + 1).map((course, index) => (
                        <tr key={index}>
                          <td><strong>{course.course_id}</strong></td>
                          <td>:</td>
                          <td>{course.course_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div></>
        )}
      </div>
    </div>
  );
};

export default StudentAchievements;
