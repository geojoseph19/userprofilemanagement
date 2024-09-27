import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Assuming you have a CSS module for styling
 
const Sidebar = ({ links, handleTabClick }) => {
  const location = useLocation();
 
  return (
    <nav className={styles.studentDash}>
      <ul className={styles.dashLinks}>
        {links.map((link, index) => (
          <li key={index} className={styles.link}>
            <Link
              to={link.to}
              className={`${location.pathname === link.to ? styles.active : ''}`}
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