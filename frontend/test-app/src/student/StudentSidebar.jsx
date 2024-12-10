import React, { useState} from 'react';
import Sidebar from '../Sidebar';
 
const StudentSidebar = () => {
  const studentLinks = [
    { name: 'Home', to: '/student/home', page: 'home',icon:'home' },
    { name: 'View full profile', to: '/student/profile', page: 'profile',icon:'account_circle' },
    { name: 'Course progress', to: '/student/progress', page: 'progress',icon:'donut_small' },
    { name: 'My Projects', to: '/student/projects', page: 'projects',icon:'content_paste'},
    { name: 'My Achievements', to: '/student/achievements', page: 'achievements',icon:'emoji_events' }
  ];
 
  const [activeTab, setActiveTab] = useState(null);
// Function to handle tab click
const handleTabClick = (page) => {
  setActiveTab(page);
};
 
  return (
    <Sidebar links={studentLinks} activeTab={activeTab} handleTabClick={handleTabClick} />
  );
};
 
export default StudentSidebar;
 