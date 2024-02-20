import React from 'react';
import {Link} from 'react-router-dom'

const StudentSidebar = () => {
  return (
        <nav className='studentDash'>
           <ul className="dashLinks">
            <li className="link">
                <Link to='/student/home'>Home</Link>
            </li>
            <li className="link">
                <Link to='/student/profile'>View full profile</Link>
            </li>
            <li className="link">
                <Link to='/student/progress'>Course progress</Link>
            </li>
            <li className="link">
                <Link to='/student/projects'>My Projects</Link>
            </li>
            <li className="link">
                <Link to='/student/achievements'>My Achievements</Link>
            </li>
           </ul>
        </nav>
  )
}

export default StudentSidebar;