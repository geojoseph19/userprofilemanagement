// Logout.js
import React from 'react';
import './Logout.css'; // Import the CSS file for the modern styling

function Logout() {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/logout', {
        method: 'POST',
      });

      if (response.ok) {
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