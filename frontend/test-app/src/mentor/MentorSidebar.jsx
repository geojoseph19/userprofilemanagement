// MentorSidebar.js

import React from 'react';
import Sidebar from '../Sidebar';


const MentorSidebar = () => {
  const Mentorlinks = [
    { name: 'Home', to: '/mentor/home' },
    { name: 'View full profile', to: '/mentor/profile' },
    { name: 'Projects', to: '/mentor/projects' }
  ];
  return (
   <Sidebar links={Mentorlinks} />
  );
};

export default MentorSidebar;
