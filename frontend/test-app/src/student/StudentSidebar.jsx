// StudentSidebar.js

import React from 'react';
import Sidebar from '../Sidebar';


const StudentSidebar = () => {
  const Studentlinks = [
    { name: 'Home', to: '/student/home' },
    { name: 'View full profile', to: '/student/profile' },
    { name: 'Course progress', to: '/student/progress' },
    { name: 'My Projects', to: '/student/projects' },
    { name: 'My Achievements', to: '/student/achievements' }
  ];
  return (
   <Sidebar links={Studentlinks} />
  );
};

export default StudentSidebar;
