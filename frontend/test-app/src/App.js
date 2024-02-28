import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import styles from './App.module.css'
import LoginPage from './LoginPage';
import ForgotPassword from './ForgotPassword';
import NotFoundPage from './NotFoundPage'; // Import the NotFoundPage component
import Layout from './Layout';
import AuthWrapper from './AuthWrapper'; // Global styles
import axios from 'axios';

import AdminHome from './admin/AdminHome/AdminHome';
import AddUser from './admin/AddUser/AddUser';
import UpdateUser from './admin/UpdateUser/UpdateUser';
import DeleteUser from './admin/DeleteUser/DeleteUser';
import AdminSidebar from './admin/AdminSidebar';

import MentorHome from './mentor/MentorHome';
import MentorProfile from './mentor/MentorProfile';
import MentorProjects from './mentor/MentorProjects';

import StudentHome from './student/StudentHome';
import StudentProfile from './student/StudentProfile';
import Progress from './student/Progress';
import StudentProjects from './student/StudentProjects';
import Achievements from './student/Achievements';
import { SharedUserDataProvider } from './UserContextShare';
import StudentSidebar from './student/StudentSidebar';
import MentorSidebar from './mentor/MentorSidebar';


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate(); // Initialize navigate hook
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isForgotPassword = location.pathname === '/forgot-password';
  const is404Page = location.pathname === '*';

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <div>
      {!isLoginPage && !isForgotPassword && !is404Page }
      <SharedUserDataProvider>
      <Routes>
        <Route path="/" element={<AuthWrapper><LoginPage /></AuthWrapper>} />
        <Route path="/forgot-password" element={<AuthWrapper><ForgotPassword /></AuthWrapper>} />
        <Route path="/home/*" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} /> 
        
        <Route path="/admin" >
            <Route path='home' element={<Layout sidebar={<AdminSidebar/>}childComponent={<AdminHome/>}/>}/>
            <Route path='addUser' element={<Layout sidebar={<AdminSidebar/>} childComponent={<AddUser/>}/>} />
            <Route path='updateUser' element={<Layout sidebar={<AdminSidebar/>} childComponent={<UpdateUser />}/>} />
            <Route path='deleteUser' element={<Layout sidebar={<AdminSidebar/>} childComponent={<DeleteUser />} />} />
        </Route>

        <Route path="/student" >
            <Route path='home' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentHome />}/>}/>
            <Route path='profile' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentProfile />}/>} />
            <Route path='progress' element={<Layout sidebar={<StudentSidebar/>} childComponent={<Progress />}/>} />
            <Route path='projects' element={<Layout sidebar={<StudentSidebar/>} childComponent={<StudentProjects />} />} />
            <Route path='achievements' element={<Layout sidebar={<StudentSidebar/>} childComponent={<Achievements />} />} />
        </Route>

        <Route path="/mentor" >
            <Route path='home' element={<Layout sidebar={<MentorSidebar/>} childComponent={<MentorHome />}/>}/>
            <Route path='profile' element={<Layout sidebar={<MentorSidebar/>} childComponent={<MentorProfile />}/>}/>
            <Route path='projects' element={<Layout sidebar={<MentorSidebar/>} childComponent={<MentorProjects />}/>}/>
      
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
  
  switch (userRole) {
    case 'student':
      return (
        
        <div className={styles.studentPage}>
         <Layout sidebar={<StudentSidebar/>} childComponent={<StudentHome />}/>
        </div>
      );
    case 'admin':
      return (
        
        <div className={styles.studentPage}>
         <Layout sidebar={<AdminSidebar/>} childComponent={<AdminHome />}/>
        </div>
      );
      
    case 'mentor':
      return (
      <div className={styles.studentPage}>
      <Layout sidebar={<MentorSidebar/>} childComponent={<MentorHome />}/>
     </div>
   );
    default:
      return <LoginPage />;
  }
}

export default App;
