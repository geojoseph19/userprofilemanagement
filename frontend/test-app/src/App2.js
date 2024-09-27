import React, { useState } from 'react';
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
import EditProfile from './EditProfile'; 
import styles from './App.module.css'
import Layout from './Layout';
import { SharedUserDataProvider } from './UserContextShare';
import AuthWrapper from './AuthWrapper';
import StudentSidebar from './student/StudentSidebar';

function App() {
  const [formData, setFormData] = useState(null);
  
  return (
    <Router>
      <AppContent formData={formData} setFormData={setFormData} />
    </Router>
  );
}

function AppContent({ formData, setFormData }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isForgotPassword = location.pathname === '/forgot-password';

  // Retrieve user role from local storage
  let userRole = localStorage.getItem('userRole');
  userRole = userRole ? userRole.replace(/"/g, '') : 'guest'; // Default role if not provided

  // Define fieldOrder based on userRole
  const fieldOrder = userRole === 'student'
    ? ['username', 'first_name', 'middle_name', 'last_name', 'sex', 'email_id', 'student_phone_no', 'address', 'guardian_name', 'guardian_phone_no', 'department', 'semester']
    : ['username', 'first_name', 'last_name', 'email_id', 'mentor_phone_no', 'department', 'expertise'];

  return (
    <div>
      {!isLoginPage && !isForgotPassword}
      <SharedUserDataProvider>
        <Routes>
          <Route exact path="/" element={<AuthWrapper><LoginPage /></AuthWrapper>} />
          <Route path="/forgot-password" element={<AuthWrapper><ForgotPassword /></AuthWrapper>} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/edit-profile" element={<Layout sidebar={<StudentSidebar/>} childComponent={<EditProfile formData={formData} setFormData={setFormData} role={userRole} fieldOrder={fieldOrder} />} />} />
          <Route path="/student" >
            <Route path='home' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentHome />}/>}/>
            <Route path='profile' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentProfile />}/>} />
            <Route path='progress' element={<Layout sidebar={<StudentSidebar/>} childComponent={<Progress />}/>} />
            <Route path='projects' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentProjects />} />} />
            <Route path='achievements' element={<Layout sidebar={<StudentSidebar/>} childComponent={<Achievements />} />} />
          </Route>
          <Route path="/mentor" >
            <Route path='home' element={<Layout sidebar={<StudentSidebar/>} childComponent={<MentorHome />}/>}/>
            <Route path='edit-profile' element={<Layout sidebar={<StudentSidebar/>} childComponent={<EditProfile formData={formData} setFormData={setFormData} role={userRole} fieldOrder={fieldOrder} />} />} />
            {/* Add mentor-specific routes if needed */}
          </Route>
          <Route path="/admin" element={<AdminHome />} />
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
