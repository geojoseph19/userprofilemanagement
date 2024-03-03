import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';


const Sidebar = ({ links}) => {
  const [activeTab, setActiveTab] = useState(null); // State to manage active tab

  // useEffect to set the default active tab based on the URL path
  useEffect(() => {
    // Extract the path from the URL
    const path = window.location.pathname;

    // Set the active tab based on the URL path
    setActiveTab(path);
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  return (
    <div className={styles.sidebar}>
    <nav className={styles.studentDash}>
      <ul className={styles.dashLinks}>
        {links.map((link, index) => (
          <li key={index} className={styles.link}>
            <Link
              to={link.to}
              className={`${activeTab === link.page ? styles.active : ''}`}
              onClick={() => handleTabClick(link.page)}>
              {/* {link.name} */}
              <div className={styles.icon}>
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    </div>
  );
};

export default Sidebar;
