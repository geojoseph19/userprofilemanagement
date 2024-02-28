import React from "react";
import DisplayBoard from "./DisplayBoard";
import Header from "./Header";
import styles from "./Layout.module.css"

const Layout = ({ sidebar,childComponent }) => {
  return (
    <div className={styles.mainContainer}>
    
      <Header />
      <div className={styles.layoutContainer}>
       {sidebar}
        <div className={styles.contentBoard}>
          <DisplayBoard childComponent={childComponent} />
        </div>
      </div>
    </div>
    
  );
};

export default Layout;
