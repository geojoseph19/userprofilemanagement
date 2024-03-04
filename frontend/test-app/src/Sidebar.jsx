// Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Assuming you have a CSS module for styling

const Sidebar = ({ links, activeTab, handleTabClick }) => {
  return (
    <nav className={styles.studentDash}>
      <ul className={styles.dashLinks}>
        {links.map((link, index) => (
          <li key={index} className={styles.link}>
            <Link
              to={link.to}
              className={`${activeTab === link.page ? styles.active : ''}`}
              onClick={() => handleTabClick(link.page)}
            >
              <div className={styles.icon}>
                <span className="material-symbols-outlined">{link.icon}</span> 
                {link.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;