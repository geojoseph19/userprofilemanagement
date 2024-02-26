import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminSidebar.module.css'; // Import CSS module

const AdminSidebar = () => {
  const [activeTab, setActiveTab] = useState(null); // State to manage active tab

  // Function to handle click event on tab
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // useEffect to set the default active tab based on the URL path
  useEffect(() => {
    // Extract the path from the URL
    const path = window.location.pathname;

    // Set the active tab based on the URL path
    if (path === '/admin/home') {
      setActiveTab('home');
    }
  }, []); // Empty dependency array ensures useEffect runs only once when the component mounts

  return (
    <nav className={styles.adminDash}>
      <ul className={styles.dashLinks}>
        <li className={styles.link}>
          <Link to='/admin/home' className={activeTab === 'home' ? styles.active : ''} onClick={() => handleTabClick('home')}>
            <div className={styles.icon}><span className="material-symbols-outlined">home</span>
              Home
            </div>
          </Link>
        </li>
        <li className={styles.link}>
          <Link to='/admin/AddUser' className={activeTab === 'AddUser' ? styles.active : ''} onClick={() => handleTabClick('AddUser')}>
            <div className={styles.icon}><span className="material-symbols-outlined">person_add</span>
              Add User
            </div>
          </Link>
        </li>
        <li className={styles.link}>
          <Link to='/admin/UpdateUser' className={activeTab === 'UpdateUser' ? styles.active : ''} onClick={() => handleTabClick('UpdateUser')}>
            <div className={styles.icon}><span className="material-symbols-outlined">manage_accounts</span>
              Update User
            </div>
          </Link>
        </li>
        <li className={styles.link}>
          <Link to='/admin/DeleteUser' className={activeTab === 'DeleteUser' ? styles.active : ''} onClick={() => handleTabClick('DeleteUser')}>
            <div className={styles.icon}><span className="material-symbols-outlined">person_remove</span>
              Delete User
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default AdminSidebar;
