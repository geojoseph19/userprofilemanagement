import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS file

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Validate username and password (dummy validation for demonstration)
    if (username === 'admin' && password === 'admin') {
      // Redirect to SecondPage on successful login
      window.location.href = '/second';
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-container"> {/* Apply CSS class */}
      <h2>Login</h2>
      <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}> {/* Apply CSS class */}
        <div>
          <label htmlFor="username">Username:</label>
          <input className="login-input" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} /> {/* Apply CSS class */}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input className="login-input" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} /> {/* Apply CSS class */}
        </div>
        <button className="login-button" type="submit">Login</button> {/* Apply CSS class */}
      </form>
    </div>
  );
}

export default LoginPage;
