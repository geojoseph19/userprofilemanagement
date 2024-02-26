// StudentSidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StudentSidebar.module.css'; // Import module.css file

const StudentSidebar = () => {
  return (
    <nav className={styles.studentDash}> {/* Use styles from module.css */}
      <ul className={styles.dashLinks}> {/* Use styles from module.css */}
        <li className={styles.link}> {/* Use styles from module.css */}
          <Link to='/student/home'>
            
            Home
          </Link>
        </li>
        <li className={styles.link}> {/* Use styles from module.css */}
          <Link to='/student/profile'>View full profile</Link>
        </li>
        <li className={styles.link}> {/* Use styles from module.css */}
          <Link to='/student/progress'>Course progress</Link>
        </li>
        <li className={styles.link}> {/* Use styles from module.css */}
          <Link to='/student/projects'>My Projects</Link>
        </li>
        <li className={styles.link}> {/* Use styles from module.css */}
          <Link to='/student/achievements'>My Achievements</Link>
        </li>
      </ul>
    </nav>
  );
};

export default StudentSidebar;
