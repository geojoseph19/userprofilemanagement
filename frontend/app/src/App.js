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
import { SharedUserDataProvider } from './UserContextShare';
import AuthWrapper from './AuthWrapper';
import StudentSidebar from './student/StudentSidebar';



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
        <SharedUserDataProvider>
        <Routes>
          <Route exact path="/" element={<AuthWrapper><LoginPage /></AuthWrapper>} />
          <Route path="/forgot-password" element={<AuthWrapper><ForgotPassword /></AuthWrapper>} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/student" >
            <Route path='home' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentHome />}/>}/>
            <Route path='profile' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentProfile />}/>} />
            <Route path='progress' element={<Layout sidebar={<StudentSidebar/>} childComponent={<Progress />}/>} />
            <Route path='projects' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentProjects />} />} />
            <Route path='achievements' element={<Layout sidebar={<StudentSidebar/>} childComponent={<Achievements />} />} />
          </Route>
        </Routes>
        </SharedUserDataProvider>
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
         <Layout  sidebar={<StudentSidebar/>} childComponent={<StudentHome />}/>
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
