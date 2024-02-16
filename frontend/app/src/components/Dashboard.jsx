
import {Link} from 'react-router-dom'
import React from 'react';
import dash from './Dashboard.module.css'; // Import your CSS file for styling

const Dashboard = () => {
    return (
        <div className="vertical-dashboard">
           <ul className={dash.links}>
            <li className='link'>
                <Link className='dashRoute' to="/assignedproj">My Projects</Link>
            </li>
            <li className='link'>
                <Link className='dashRoute' to="/awards">My Achievements</Link>
            </li>
           </ul>
            {/* Add more dashboard items as needed */}
        </div>

    );
}

export default Dashboard;
