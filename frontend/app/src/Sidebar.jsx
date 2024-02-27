// GenericSidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'


const Sidebar = ({ links }) => {
  return (
    <nav className={styles.studentDash}> {/* Use styles from module.css */}
      <ul className={styles.dashLinks}> {/* Use styles from module.css */}
        {links.map((link, index) => (
          <li key={index} className={styles.link}> {/* Use styles from module.css */}
            <Link to={link.to}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
