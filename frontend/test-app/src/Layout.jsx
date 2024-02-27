import React from "react";
import StudentSidebar from "./student/StudentSidebar";
import MentorSidebar from "./mentor/MentorSidebar";
import DisplayBoard from "./DisplayBoard";
import Header from "./Header";
import styles from "./Layout.module.css"

const Layout = ({ childComponent }) => {
  return (
    <div className={styles.mainContainer}>
    
      <Header />
      <div className={styles.layoutContainer}>
        <MentorSidebar />
        <div className={styles.contentBoard}>
          <DisplayBoard childComponent={childComponent} />
        </div>
      </div>
    </div>
    
  );
};

export default Layout;
