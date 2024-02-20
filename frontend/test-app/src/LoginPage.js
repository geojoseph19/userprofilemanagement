// LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS file
import { TypingAnimation } from './Animations.js';
//import styles from './bootstrap.module.css';
import axios from 'axios'; // Import Axios
axios.defaults.withCredentials = true;

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/v1/login', { username, password });

      console.log(response);

      if (response.status === 200) {
        // Extract the role from the response (assuming it's included in the response)
        const role = response.data.role_type; // Change 'role' to the actual key in the response object

        // Redirect to home page with the role as a query parameter
        window.location.href = `/home?role=${role}`;
      } else {
        // Handle invalid username or password
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className='body-container'>
    <div className="login-container"> {/* Apply CSS class */}
      <div className='login-left-container'>
        <h1>Login</h1>
        <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}> {/* Apply CSS class */}
          <div className='input-set'>
            <label className="input-label" htmlFor="username">Username</label>
            <input className="login-input" type="text" id="username" placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} /> {/* Apply CSS class */}
          </div>
          <div className='input-set'>
            <label className="input-label" htmlFor="password">Password</label>
            <input className="login-input" type="password" id="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} /> {/* Apply CSS class */}
          </div>
          <div className='input-set'>
          <button className="login-button" type="submit">Sign in</button> {/* Apply CSS class */}
          </div>
        </form>
      </div>
      <div className='login-right-container'>

      {/* <h1><TypingAnimation text="Tarento University." speed={100} /></h1> */}
      <h1>Hogwarts University.</h1> 
      <p><TypingAnimation text="Igniting Futures, Inspiring Minds.." speed={100} initialDelay={1500} /></p>
      

      </div>

    </div>
    </div>
  );
}

export default LoginPage;
