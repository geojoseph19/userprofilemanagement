import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ links, activeTab, handleTabClick }) => {
  return (
    <div className={styles.sidebar}>
    <nav className={styles.studentDash}>
      <ul className={styles.dashLinks}>
        {links.map((link, index) => (
          <li key={index} className={styles.link}>
            <Link
              to={link.to}
              className={`${activeTab === link.page ? styles.active : ''}`}
              onClick={() => handleTabClick(link.page)}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    </div>
  );
};

export default Sidebar;
