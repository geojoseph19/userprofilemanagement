import React from "react";
import DisplayBoard from "./DisplayBoard";
import Header from "./Header";

const Layout = (props) => {
  return (
    <div className="mainContainer">
    
      <div className="layout-container">
        {props.sidebar}
        <div className="contentBoard">
          <DisplayBoard childComponent={props.childComponent} />
        </div>
      </div>
    </div>
    
  );
};

export default Layout;