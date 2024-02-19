import React from 'react';
import {Link} from 'react-router-dom'

const StudentSidebar = () => {
  return (
        <nav className='studentDash'>
           <ul className="dashLinks">
            <li className="link">
                <Link to='/home/*'>Home</Link>
            </li>
            <li className="link">
                <Link to='/profile'>View full profile</Link>
            </li>
            <li className="link">
                <Link to='/progress'>Course progress</Link>
            </li>
            <li className="link">
                <Link to='/projects'>My Projects</Link>
            </li>
            <li className="link">
                <Link to='/achievements'>My Achievements</Link>
            </li>
           </ul>
        </nav>
  )
}

export default StudentSidebar;