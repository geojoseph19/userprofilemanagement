// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import ForgotPassword from './ForgotPassword';
import StudentHome from './student/StudentHome';
import AdminHome from './admin/AdminHome/AdminHome';
import MentorHome from './mentor/MentorHome';
import AuthWrapper from './AuthWrapper'; // Global styles
import StudentSidebar from './student/StudentSidebar';
import StudentProfile from './student/StudentProfile';
import Progress from './student/Progress';
import StudentProjects from './student/StudentProjects';
import Achievements from './student/Achievements';
import Header from './Header'; // Import the Header component
import './App.css'
import Layout from './Layout';
import AddUser from './admin/AddUser/AddUser';
import UpdateUser from './admin/UpdateUser/UpdateUser';
import DeleteUser from './admin/DeleteUser/DeleteUser';
import AdminSidebar from './admin/AdminSidebar/AdminSidebar';

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
        <Route path="/student" >
            <Route path='home' element={<Layout sidebar={<StudentSidebar/>}childComponent={<StudentHome />}/>}/>
            <Route path='profile' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentProfile />}/>} />
            <Route path='progress' element={<Layout sidebar={<StudentSidebar/>} childComponent={<Progress />}/>} />
            <Route path='projects' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentProjects />} />} />
            <Route path='achievements' element={<Layout sidebar={<StudentSidebar/>} childComponent={<Achievements />} />} />
          </Route>
          <Route path="/admin" >
            <Route path='home' element={<Layout sidebar={<AdminSidebar/>}childComponent={<AdminHome/>}/>}/>
            <Route path='addUser' element={<Layout sidebar={<AdminSidebar/>} childComponent={<AddUser/>}/>} />
            <Route path='updateUser' element={<Layout sidebar={<AdminSidebar/>} childComponent={<UpdateUser />}/>} />
            <Route path='deleteUser' element={<Layout sidebar={<AdminSidebar/>} childComponent={<DeleteUser />} />} />
          </Route>
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
