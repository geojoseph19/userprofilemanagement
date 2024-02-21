import React from "react";
import StudentSidebar from "./student/StudentSidebar";
import DisplayBoard from "./DisplayBoard";
import Header from "./Header";

const Layout = ({ childComponent }) => {
  return (
    <div className="mainContainer">
    
      <Header />
      <div className="layout-container">
        <StudentSidebar />
        <div className="contentBoard">
          <DisplayBoard childComponent={childComponent} />
        </div>
      </div>
    </div>
    
  );
};

export default Layout;
