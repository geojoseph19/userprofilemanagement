import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';

const StudentSidebar = () => {
  const [activeTab, setActiveTab] = useState(null); // State to manage active tab

  // useEffect to set the default active tab based on the URL path
  useEffect(() => {
    // Extract the path from the URL
    const path = window.location.pathname;

    // Set the active tab based on the URL path
    setActiveTab(path);
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const studentLinks = [
    { name: 'Home', to: '/student/home',page:'home' },
    { name: 'View full profile', to: '/student/profile',page:'profile'},
    { name: 'Course progress', to: '/student/progress' ,page:'progress'},
    { name: 'My Projects', to: '/student/projects' ,page:'projects'},
    { name: 'My Achievements', to: '/student/achievements' ,page:'achievements'}
  ];

  return (
    <Sidebar links={studentLinks} activeTab={activeTab} handleTabClick={handleTabClick} />
  );
};

export default StudentSidebar;
