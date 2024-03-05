import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import styles from './App.module.css'
import LoginPage from './LoginPage';
import ForgotPassword from './ForgotPassword';
import NotFoundPage from './NotFoundPage'; // Import the NotFoundPage component
import Layout from './Layout';
import AuthWrapper from './AuthWrapper'; // Global styles
import axios from 'axios';

import Sidebar from './Sidebar';

import AdminHome from './admin/AdminHome/AdminHome';
import AddUser from './admin/AddUser/AddUser';
import UpdateUser from './admin/UpdateUser/UpdateUser';
import DeleteUser from './admin/DeleteUser/DeleteUser';
import AdminSidebar from './admin/AdminSidebar';

import MentorHome from './mentor/MentorHome';
import MentorProfile from './mentor/MentorProfile';
import MentorProjects from './mentor/MentorProjects';
import MentorAchievements from './mentor/MentorAchievements';

import StudentHome from './student/StudentHome';
import StudentProfile from './student/StudentProfile';
import Progress from './student/Progress';
import StudentProjects from './student/StudentProjects';
import Achievements from './student/Achievements';
import { SharedUserDataProvider } from './UserContextShare';
import StudentSidebar from './student/StudentSidebar';
import MentorSidebar from './mentor/MentorSidebar';

import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

function App() {
  const [formData, setFormData] = useState(null);
  
  return (
    <Router>
      <AppContent formData={formData} setFormData={setFormData} />
    </Router>
  );
}

function AppContent({ formData, setFormData }) {
  const navigate = useNavigate(); // Initialize navigate hook
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isForgotPassword = location.pathname === '/forgot-password';
  const is404Page = location.pathname === '*';
  


  // Retrieve user role from local storage
  let userRole = localStorage.getItem('userRole');
  userRole = userRole ? userRole.replace(/"/g, '') : 'guest'; // Default role if not provided

  const studentLinks = [
    { name: 'Home', to: '/student/home', page: 'home',icon:'home' },
    { name: 'View full profile', to: '/student/profile', page: 'profile',icon:'account_circle' },
    { name: 'Course progress', to: '/student/progress', page: 'progress',icon:'donut_small' },
    { name: 'My Projects', to: '/student/projects', page: 'projects',icon:'content_paste'},
    { name: 'Achievements', to: '/student/achievements', page: 'achievements',icon:'emoji_events' }
  ];

  const Adminlinks = [
    { name: 'Home', to: '/admin/home', page: 'Home', icon: 'home' }, // Added an icon property for the Home link
    { name: 'Add User', to: '/admin/AddUser', page: 'Add User', icon: 'person_add' },
    { name: 'Update User', to: '/admin/UpdateUser', page: 'Update User', icon: 'manage_accounts' },
    { name: 'Delete User', to: '/admin/DeleteUser', page: 'Delete User', icon: 'person_remove' }
  ];

  const Mentorlinks = [
    { name: 'Home', to: '/mentor/home', page: 'home', icon: 'home' },
    { name: 'View full profile', to: '/mentor/profile', page: 'Profile', icon: 'account_circle' },
    { name: 'Projects', to: '/mentor/projects', page: 'Projects', icon: 'content_paste' },
    { name: 'Achievements', to: '/mentor/achievements', page: 'Achievements', icon: 'emoji_events' }
  ];

  // Define fieldOrder based on userRole
const LayoutVariables = userRole === 'student'
? {
    fieldOrder: ['username', 'first_name', 'middle_name', 'last_name', 'sex', 'email_id', 'student_phone_no', 'address', 'guardian_name', 'guardian_phone_no', 'department', 'semester'],
    sidebarLinks: studentLinks
  }
: userRole === 'mentor'
? {
    fieldOrder: ['username', 'first_name', 'last_name', 'email', 'department', 'expertise'],
    sidebarLinks: Mentorlinks
  }
: userRole === 'admin'
? {
    fieldOrder: ['username', 'first_name', 'last_name', 'email', 'department', 'expertise'],
    sidebarLinks: Adminlinks
  }
: { fieldOrder: [], sidebarLinks: [] };


useEffect(() => {
  console.log('useEffect triggered');
  
  const interceptor = axios.interceptors.response.use(
    response => {
      console.log('Interceptor - Response:', response);
      return response;
    },
    error => {
      console.log('Interceptor - Error:', error);
      if (error.response && error.response.status === 401) {
        console.log('Interceptor - Redirecting to login page');
        // Redirect to login page
        window.location.href = "/";
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
          <Route exact path="/" element={<AuthWrapper><LoginPage /></AuthWrapper>} />
          <Route path="/forgot-password" element={<AuthWrapper><ForgotPassword /></AuthWrapper>} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/edit-profile" element={<Layout sidebar={<Sidebar links={LayoutVariables.sidebarLinks}  />} childComponent={<EditProfile formData={formData} setFormData={setFormData} role={userRole} fieldOrder={LayoutVariables.fieldOrder} />} />} />
          <Route path='/change-password' element={<Layout sidebar={<Sidebar links={LayoutVariables.sidebarLinks} />} childComponent={<ChangePassword />}/>}/>
         
        <Route path="/student" >
            <Route path='home' element={<Layout sidebar={<Sidebar links={LayoutVariables.sidebarLinks}  />} childComponent={<StudentHome />}/>}/>
            <Route path='profile' element={<Layout sidebar={<Sidebar links={LayoutVariables.sidebarLinks}  />} childComponent={<StudentProfile />}/>} />
            <Route path='progress' element={<Layout sidebar={<Sidebar links={LayoutVariables.sidebarLinks}  />} childComponent={<Progress />}/>} />
            <Route path='projects' element={<Layout sidebar={<Sidebar links={LayoutVariables.sidebarLinks}  />} childComponent={<StudentProjects />} />} />
            <Route path='achievements' element={<Layout sidebar={<Sidebar links={LayoutVariables.sidebarLinks}  />} childComponent={<Achievements />} />} />
        </Route>

        <Route path="/admin" >
            <Route path='home' element={<Layout sidebar={<AdminSidebar/>}childComponent={<AdminHome/>}/>}/>
            <Route path='addUser' element={<Layout sidebar={<AdminSidebar/>} childComponent={<AddUser/>}/>} />
            <Route path='updateUser' element={<Layout sidebar={<AdminSidebar/>} childComponent={<UpdateUser />}/>} />
            <Route path='deleteUser' element={<Layout sidebar={<AdminSidebar/>} childComponent={<DeleteUser />} />} />
        </Route>

        <Route path="/mentor" >
            <Route path='home' element={<Layout sidebar={<MentorSidebar/>} childComponent={<MentorHome />}/>}/>
            <Route path='profile' element={<Layout sidebar={<MentorSidebar/>} childComponent={<MentorProfile />}/>}/>
            <Route path='projects' element={<Layout sidebar={<MentorSidebar/>} childComponent={<MentorProjects />}/>}/>
            <Route path='achievements' element={<Layout sidebar={<MentorSidebar/>} childComponent={<MentorAchievements />}/>}/>
      
        </Route>
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="*" element={<NotFoundPage />} />
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
