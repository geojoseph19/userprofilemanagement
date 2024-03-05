import React from "react";
import DisplayBoard from "./DisplayBoard";
import Header from "./Header";
import styles from "./Layout.module.css"

const Layout = (props) => {
  return (
    <div className={styles.mainContainer}>
    
      <Header />
      <div className={styles.layoutContainer}>
        {props.sidebar}
        <DisplayBoard childComponent={props.childComponent} />
        
      </div>
    </div>
    
  );
};

export default Layout;
