// AdminSidebar.js

import React from 'react';
import Sidebar from '../Sidebar';


const AdminSidebar = () => {
  const Adminlinks = [
    { name: 'Home', to: '/admin/home' },
    { name: 'Add User', to: '/admin/AddUser' },
    { name: 'Update User', to: '/admin/UpdateUser' },
    { name: 'Delete User', to: '/admin/DeleteUser' }
  ];
  return (
   <Sidebar links={Adminlinks} />
  );
};

export default AdminSidebar;
