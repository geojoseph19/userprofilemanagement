// MentorSidebar.js
 
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
 
const MentorSidebar = () => {
  const Mentorlinks = [
    { name: 'Home', to: '/mentor/home', page: 'home', icon: 'home' },
    { name: 'View full profile', to: '/mentor/profile', page: 'Profile', icon: 'account_circle' },
    { name: 'Projects', to: '/mentor/projects', page: 'Projects', icon: 'content_paste' },
    { name: 'Achievements', to: '/mentor/achievements', page: 'Achievements', icon: 'content_paste' }
  ];
 
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState(null);
 
  // Function to handle tab click
  const handleTabClick = (page) => {
    setActiveTab(page);
  };
 
  return (
    <Sidebar links={Mentorlinks} activeTab={activeTab} handleTabClick={handleTabClick} />
  );
};
 
export default MentorSidebar;
 