import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './Progress.module.css';
import ProgressRing from './ProgressRing';
import { SharedUserContext } from '../UserContextShare';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const { setCurrentSemester, setTotalSemesters } = useContext(SharedUserContext);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/student/progress');
        const progressData = response.data.response;
        setProgress(progressData);
        setCurrentSemester(progressData.current_semester);
        setTotalSemesters(progressData.total_semesters);
      } catch (error) {
        console.error('Error fetching Progress:', error);
      }
    };

    fetchProgress();
  }, [setCurrentSemester, setTotalSemesters]);

  return (
    <div className={styles.Main}>
      <div className="pageTitle"><h1>Course Progress</h1></div>
      <div className={styles.info}>
        {progress && (
          <>
            <div className={styles.wheel}>
              <h3>Current semester</h3>
              <ProgressRing currentSemester={progress.current_semester} totalSemesters={progress.total_semesters}/>
            </div>
            <div className={styles.progressInfo}>
              {[...Array(progress.current_semester)].map((_, semesterIndex) => {
                const semesterCourses = progress.courses_completed.filter(course => course.semester === semesterIndex + 1);
                if (semesterCourses.length === 0) return null; 
                return (
                  <div key={semesterIndex} className={styles.semester}>
                    <h2>{`Semester ${semesterIndex + 1}`}</h2>
                    <hr />
                    <table>
                      <tbody>
                        {semesterCourses.map((course, index) => (
                          <tr key={index}>
                            <td><strong>{course.course_id}</strong></td>
                            <td>:</td>
                            <td>{course.course_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
