// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import StudentHome from './student/StudentHome';
import AdminHome from './admin/AdminHome';
import MentorHome from './mentor/MentorHome';
import StudentSidebar from './student/StudentSidebar';
import StudentProfile from './student/StudentProfile';
import Progress from './student/Progress';
import StudentProjects from './student/StudentProjects';
import Achievements from './student/Achievements';
import Header from './Header'; // Import the Header component
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <Header /> {/* Include the Header component */}
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/home/*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userRole = searchParams.get('role') || 'guest'; // Default role if not provided

  // Render different home pages based on user role
  switch (userRole) {
    case 'student':
      return (
        <div className='studentPage'>
         <StudentSidebar />
          <Routes>
            <Route index element={<StudentHome />} />
            <Route path='/home/*' element={<StudentHome />} />
            <Route path='/profile' element={<StudentProfile />} />
            <Route path='/progress' element={<Progress />} />
            <Route path='/projects' element={<StudentProjects />} />
            <Route path='/achievements' element={<Achievements />} />

          </Routes>
          
        {/* </Router> */}
        </div>
      );
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
