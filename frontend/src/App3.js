import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import StudentHome from './student/StudentHome';
import AdminHome from './admin/AdminHome/AdminHome';
import MentorHome from './mentor/MentorHome';
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
import AdminSidebar from './Sidebar/AdminSidebar/AdminSidebar';

function App() {
  return (
    <Router>
      <div>
       {/* Include the Header component */}
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/home/*" element={<Home />} />
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
         <Layout childComponent={<StudentHome />}/>
        </div>
      );
    case 'admin':
      return (
        <div className='adminPage'>
         <Layout childComponent={<AdminHome />}/>
        </div>
      );
    case 'mentor':
      return <MentorHome />;
    default:
      // Redirect to login page if role not recognized
      return <LoginPage />;
  }
}


export default App;