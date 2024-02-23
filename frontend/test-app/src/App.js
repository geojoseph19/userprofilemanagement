// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import ForgotPassword from './ForgotPassword';
import StudentHome from './StudentHome';
import AdminHome from './AdminHome';
import MentorHome from './MentorHome';
import Header from './Header'; // Import the Header component
import AuthWrapper from './AuthWrapper'; // Global styles

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isForgotPassword = location.pathname === '/forgot-password';

  return (
    <div>
      {!isLoginPage && !isForgotPassword && <Header />}
      <Routes>
        <Route path="/" element={<AuthWrapper><LoginPage /></AuthWrapper>} />
        <Route path="/forgot-password" element={<AuthWrapper><ForgotPassword /></AuthWrapper>} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

function Home() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userRole = searchParams.get('role') || 'guest'; // Default role if not provided

  switch (userRole) {
    case 'student':
      return <StudentHome />;
    case 'admin':
      return <AdminHome />;
    case 'mentor':
      return <MentorHome />;
    default:
      return <LoginPage />;
  }
}

export default App;
