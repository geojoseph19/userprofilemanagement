import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import styles from "./Header.module.css";
import logoImage from "./assets/headerLogo.png"; 

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      const response = await axios.post('http://127.0.0.1:5000/api/v1/logout');

      if (response.status === 200) {
        // Redirect to the login page or do any other necessary action
        window.location.href = '/';
      } else {
        // Handle logout error
        alert('Couldn\'t logout at the moment.\nPlease try again');
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <header className={styles.header}>
      <img src={logoImage} alt="Hogwarts University" className={styles.logo} />

      <div className={styles.dropdown}>
        <button className={styles.dropbutton} onClick={toggleDropdown}>
          ☰
        </button>
        {isOpen && (
          <div className={styles.dropcontent}>
            <Link to="/edit-profile" className={styles.link}>Edit Profile</Link>
            <Link to="/change-password" className={styles.link}>Change Password</Link>
            <Link to="/" className={styles.link} onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
