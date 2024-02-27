import React from 'react';
import './Logout.css'; // Import the CSS file for the modern styling
import axios from 'axios'; // Import Axios

function Logout() {
  const handleLogout = async () => {
    try {

      localStorage.clear();
      const response = await axios.post('http://127.0.0.1:5000/api/v1/logout');

      if (response.status === 200) {
        // Redirect to the login page or do any other necessary action
        window.location.href = '/';
      } else {
        // Handle logout error
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout {/* Apply the modern CSS class */}
    </button>
  );
}

export default Logout;
