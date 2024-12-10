import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Assuming you have a CSS module for styling

const Sidebar = ({ links, handleTabClick }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };
  

  return (
    <div>
      <div className={styles.toggleButton} onClick={handleToggleSidebar}>
        <span>&#9776;</span> {/* Unicode for hamburger icon */}
      </div>
      <nav className={`${styles.studentDash} ${isSidebarOpen ? styles.open : ''}`}>
        <ul className={styles.dashLinks}>
          {links.map((link, index) => (
            <li key={index} className={styles.link}>
              <Link
                to={link.to}
                className={`${location.pathname === link.to ? styles.active : ''}`}
                onClick={() => {
                  handleTabClick(link.page);
                  // Remove the handleCloseSidebar() call here
                }}
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
    </div>
  );
};

export default Sidebar;
