import React, { useState } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.dropbutton} onClick={toggleDropdown}>
        ☰
      </button>
      {isOpen && (
        <div className={styles.dropcontent}>
          {props.links.map((link, index) => (
            <Link key={index} to={link.to} className={styles.link}>
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
