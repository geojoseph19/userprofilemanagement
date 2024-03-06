// AdminSidebar.js
 
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
 
const AdminSidebar = () => {
  const Adminlinks = [
    { name: 'Home', to: '/admin/home', page: 'Home' },
    { name: 'Add User', to: '/admin/AddUser', page: 'Add User' },
    { name: 'Update User', to: '/admin/UpdateUser', page: 'Update User' },
    { name: 'Delete User', to: '/admin/DeleteUser', page: 'Delete User' }
  ];
 
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState(null);
 
  // Function to handle tab click
  const handleTabClick = (page) => {
    setActiveTab(page);
  };
 
  return (
    <Sidebar links={Adminlinks} activeTab={activeTab} handleTabClick={handleTabClick} />
  );
};
 
export default AdminSidebar;