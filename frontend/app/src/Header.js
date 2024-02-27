// Header.js
import React from 'react';
// Import the useLocation hook
import Logout from './Logout'; // Import the Logout component
import styles from './Header.module.css';

function Header() {
 

  // Check if the current route is the SecondPage
  

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Hogwarts University</h1>
        <nav>
          <ul className={styles.navLinks}>
            {<li><Logout /></li>} {/* Render the Logout component only on the SecondPage */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
