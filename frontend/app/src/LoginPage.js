// LoginPage.js
 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css'; // Import the CSS module
import { TypingAnimation } from './Animations.js';
import axios from 'axios'; // Import Axios
axios.defaults.withCredentials = true;
 
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorMessageVisible, setIsErrorMessageVisible] = useState(false);
 
  useEffect(() => {
    if (errorMessage) {
      setIsErrorMessageVisible(true);
      const timeout = setTimeout(() => {
        setIsErrorMessageVisible(false);
        setErrorMessage('');
      }, 5000); // Adjust the timeout duration as needed
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);
 
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/v1/login', { username, password });
 
      if (response.status === 200) {
        const role = response.data.role_type; // Change 'role' to the actual key in the response object
        window.location.href = `/home?role=${role}`;
      } else {
        // Handle invalid username or password
        setErrorMessage('Invalid username or password');
        setIsErrorMessageVisible(true); // Show error message container
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Check if the error response contains a message from the backend
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
        setIsErrorMessageVisible(true); // Show error message container
      } else {
        setErrorMessage('An error occurred while logging in. Please try again.');
        setIsErrorMessageVisible(true); // Show error message container
      }
    }
  };
 
  return (
    <div className={styles['body-container']}>
      <div className={styles['login-container']}>
        <div className={styles['login-left-container']}>
          <h1>Login</h1>
          <form className={styles['login-form']} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className={styles['input-set']}>
              <label className={styles['input-label']} htmlFor="username">Username</label>
              <input className={styles['login-input']} type="text" id="username" placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className={styles['input-set']} style={{ marginBottom: '10px' }}>
              <label className={styles['input-label']} htmlFor="password">Password</label>
              <div className={styles['password-input-container']}>
                <input className={styles['login-input']} type={showPassword ? 'text' : 'password'} id="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className={styles['eye-icon']} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <span className='material-symbols-outlined'>visibility</span> : <span className='material-symbols-outlined'>visibility_off</span>}
                </div>
              </div>
            </div>
              <Link to="/forgot-password" style={{ margin: '0', paddingLeft:"171px", color: 'white',fontSize:'14px' }}>Forgot password?</Link>
            <div className={styles['input-set']}>
              <button className={styles['login-button']} type="submit">Sign in</button>
            </div>
          </form>
          {isErrorMessageVisible && (
            <div className={styles['error-message']}>
              <span className='material-symbols-outlined'>error</span>
              <p style={{ display: 'inline' }}> &nbsp; {errorMessage}</p>
            </div>
          )}
        </div>
        <div className={styles['login-right-container']}>
          <h1>Hogwarts University.</h1>
          <p><TypingAnimation text="Igniting Futures, Inspiring Minds.." speed={100} initialDelay={1500} /></p>
        </div>
      </div>
    </div>
  );
}
 
export default LoginPage;