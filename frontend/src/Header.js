// Header.js
import React from 'react';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import Logout from './Logout'; // Import the Logout component
import './Header.css';

function Header() {
  const location = useLocation();
  // Check if the current route is the SecondPage
  const isSecondPage = location.pathname === '/home';

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">Hogwarts University</h1>
        <nav>
          <ul className="nav-links">
            {isSecondPage && <li><Logout /></li>} {/* Render the Logout component only on the SecondPage */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
