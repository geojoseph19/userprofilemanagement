import React from 'react';
import styles from './Progress.module.css';

const ProgressRing = ({ currentSemester, totalSemesters }) => {
  // Calculate the progress ratio
  const progressRatio = currentSemester / totalSemesters;

  // Calculate the circumference of the ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  // Calculate the dash offset to represent progress
  const dashOffset = circumference * (1 - progressRatio);

  return (
    <svg width="200" height="200" viewBox="0 0 100 100" className={styles.progressRing}>
      <circle
        className={styles.ring}
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke="#e6e6e6"
        strokeWidth="10"
      />
      <circle
        className={styles.progressCircle}
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke="#007bff"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="#007bff">
        {currentSemester}/{totalSemesters}
      </text>
    </svg>
  );
};

export default ProgressRing;
