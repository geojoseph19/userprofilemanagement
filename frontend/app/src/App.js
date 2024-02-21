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
import Layout from './Layout';

function App() {
  return (
    <Router>
      <div>
       {/* Include the Header component */}
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/student" >
            <Route path='home' element={<Layout childComponent={<StudentHome />}/>}/>
            <Route path='profile' element={<Layout childComponent={<StudentProfile />}/>} />
            <Route path='progress' element={<Layout childComponent={<Progress />}/>} />
            <Route path='projects' element={<Layout childComponent={<StudentProjects />} />} />
            <Route path='achievements' element={<Layout childComponent={<Achievements />} />} />
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
          <Routes>
            <Route path='/home/*' element={<Layout childComponent={<StudentHome />}/>} />
            <Route path='/profile' element={<Layout childComponent={<StudentProfile />}/>} />
            <Route path='/progress' element={<Layout childComponent={<Progress />}/>} />
            <Route path='/projects' element={<Layout childComponent={<StudentProjects />} />} />
            <Route path='/achievements' element={<Layout childComponent={<Achievements />} />} />

          </Routes>
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
