import React, { useState, useEffect ,useRef} from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Header.module.css';
import Swal from 'sweetalert2';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let response;
        if (location.pathname.includes('/admin')) {
          response = await axios.get('http://127.0.0.1:5000/api/v1/admin/home');
        } else if (location.pathname.includes('/mentor')) {
          response = await axios.get('http://127.0.0.1:5000/api/v1/mentor/home');
        } else {
          response = await axios.get('http://127.0.0.1:5000/api/v1/student/home');
        }
        setFirstName(response.data.response.First_Name);
        setLastName(response.data.response.Last_Name);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error
      }
    };

    fetchUserData();

    document.addEventListener('mousedown', closeDropdown);

    return () => {
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, [location]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Log Out',
        text: 'Do you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Log Out',
        confirmButtonColor: '#040F49',
        background: 'white',
        color: 'black',
      });

      if (result.isConfirmed) {
        localStorage.clear();
        const response = await axios.post('http://127.0.0.1:5000/api/v1/logout');

        if (response.status === 200) {
          // Redirect to the login page or do any other necessary action
          window.location.href = '/';
        } else {
          // Handle logout error
          alert("Couldn't logout at the moment.\nPlease try again");
        }
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Hogwarts University</h1>
      <div className={styles.dropdown} ref={dropdownRef}>
        <div className={styles.adminProfilePicContainer} onClick={toggleDropdown}>
          <img
            className={styles.adminProfilePic}
            src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
            alt="Admin Profile"
          />
        </div>
        {isOpen && (
          <div className={styles.dropcontent}>
            <Link to="/change-password" className={styles.link}>
              Change Password
            </Link>
            <button className={styles.link} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
      <span className={styles.userName}>{`${firstName} ${lastName}`}</span>

    </header>
  );
};

export default Header;
