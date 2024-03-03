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
import Sidebar from './Sidebar';
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
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isForgotPassword = location.pathname === '/forgot-password';

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
    { name: 'Projects', to: '/mentor/projects', page: 'Projects', icon: 'content_paste' }
  ];

  // Define fieldOrder based on userRole
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

  return (
    <div>
      {!isLoginPage && !isForgotPassword}
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
          <Route path="/mentor" >
            <Route path='home' element={<Layout sidebar={<Sidebar links={LayoutVariables.sidebarLinks}  />} childComponent={<MentorHome />}/>}/>
            <Route path='edit-profile' element={<Layout sidebar={<Sidebar links={LayoutVariables.sidebarLinks}  />} childComponent={<EditProfile formData={formData} setFormData={setFormData} role={userRole} fieldOrder={LayoutVariables.fieldOrder} />} />} />
            {/* Add mentor-specific routes if needed */}
          </Route>
          <Route path="/admin" element={<AdminHome />} />
        </Routes>
      </SharedUserDataProvider>
    </div>
  );
}


function Home({LayoutVariables}) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userRole = searchParams.get('role') || 'guest'; // Default role if not provided

  // Render different home pages based on user role
  switch (userRole) {
    case 'student':
      return (
        <div className={styles.studentPage}>
          <Layout  sidebar={<Sidebar links={LayoutVariables.sidebarLinks}  />} childComponent={<StudentHome />}/>
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
