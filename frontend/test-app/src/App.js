// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import StudentHome from './StudentHome';
import AdminHome from './AdminHome';
import MentorHome from './MentorHome';
import Header from './Header'; // Import the Header component

function App() {
  return (
    <Router> {/* Wrap the entire App component inside a Router */}
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div>
      {!isLoginPage && <Header />} {/* Include the Header component if not on the login page */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

function Home() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userRole = searchParams.get('role') || 'guest'; // Default role if not provided

  // Render different home pages based on user role
  switch (userRole) {
    case 'student':
      return <StudentHome />;
    case 'admin':
      return <AdminHome />;
    case 'mentor':
      return <MentorHome />;
    default:
      // Redirect to login page if role not recognized
      return <LoginPage />;
  }
}

export default App;
