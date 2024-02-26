// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import ForgotPassword from './ForgotPassword';
import StudentHome from './student/StudentHome';
import AdminHome from './admin/AdminHome';
import MentorHome from './mentor/MentorHome';
import StudentProfile from './student/StudentProfile';
import Progress from './student/Progress';
import StudentProjects from './student/StudentProjects';
import Achievements from './student/Achievements';
import styles from './App.module.css'
import Layout from './Layout';
import { SharedStudentDataProvider } from './StudentContextShare';
import AuthWrapper from './AuthWrapper';
import Header from './Header';


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
      {!isLoginPage && !isForgotPassword}
        <SharedStudentDataProvider>
        <Routes>
          <Route exact path="/" element={<AuthWrapper><LoginPage /></AuthWrapper>} />
          <Route path="/forgot-password" element={<AuthWrapper><ForgotPassword /></AuthWrapper>} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/student" >
            <Route path='home' element={<Layout childComponent={<StudentHome />}/>}/>
            <Route path='profile' element={<Layout childComponent={<StudentProfile />}/>} />
            <Route path='progress' element={<Layout childComponent={<Progress />}/>} />
            <Route path='projects' element={<Layout childComponent={<StudentProjects />} />} />
            <Route path='achievements' element={<Layout childComponent={<Achievements />} />} />
          </Route>
        </Routes>
        </SharedStudentDataProvider>
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
      return (
        <div className={styles.studentPage}>
         <Layout childComponent={<StudentHome />}/>
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
