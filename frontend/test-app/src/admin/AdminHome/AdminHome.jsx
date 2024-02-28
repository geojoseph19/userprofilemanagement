import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './AdminHome.module.css'; // Import CSS module
import axios from 'axios'; 
axios.defaults.withCredentials = true;

function AdminHome() {
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/admin/home');
        setAdminData(response.data.response);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        navigate('/');
      } 
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <div className={style.adminMain}>
      {adminData ? (
        <div className={style.adminInfo}>
          <div className={style.adminProfilePicContainer}>
            <img className={style.adminProfilePic} src='https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg' alt='Admin Profile'/>
          </div>
          <div className={style.adminInfo1}>
            <h2><strong>{adminData.First_Name} {adminData.Middle_Name} {adminData.Last_Name}</strong></h2>
            <p>Admin</p>
            <table className={style.adminInfoTable}>
              <tbody>
                <tr>
                  <td><h2>Username</h2></td>
                  <td><h3>: {adminData.Username}</h3></td>
                </tr>
                <tr>
                  <td><h2>Email</h2></td>
                  <td><h3>: {adminData.Email_ID}</h3></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default AdminHome;