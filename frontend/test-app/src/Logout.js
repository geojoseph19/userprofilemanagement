import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Logout.css'; // Import the CSS file for styling

function Logout() {
  const handleLogout = async () => {
    const apiUrl = 'http://localhost:5000/logout'; // Adjust the API URL as per your backend endpoint

    try {
      const result = await Swal.fire({
        title: 'Log Out',
        text: 'Do you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Log Out',
        confirmButtonColor: '#00ADB5',
        background: '#222831',
        color: 'white',
      });

      if (result.isConfirmed) {
        const response = await axios.post(apiUrl);

        if (response.status === 200) {
          // Handle successful logout, such as redirecting to the login page
          console.log('Logout successful:', response.data);
          // Example: Redirect to login page
          window.location.href = '/';
        } else {
          // Handle logout failure
          console.error('Logout failed:', response.data);
          // Example: Display an error message
          alert('Logout failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
      // Example: Display an error message
      alert('Error logging out. Please try again.');
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
