import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Achievements.module.css';
import InfoCard from '../InfoCard';

const StudentProjects = () => {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectInfo = localStorage.getItem('projectData');
        if (projectInfo) {
          setProjects(JSON.parse(projectInfo));
        } else {
          const response = await axios.get('http://127.0.0.1:5000/api/v1/student/project');
          const responseData = response.data.response;
          setProjects(responseData);
          localStorage.setItem('projectData', JSON.stringify(responseData)); 
        }
      } catch (error) {
        console.error('Error fetching Projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Function to format date string
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toDateString();
  };

  // Define the order of keys for displaying in the table
  const keyOrder = [
    'project_id',
    'start_date',
    'end_date',
    'mentor_id',
    'mentor_in-charge',
  ];

  return (
    <div className={styles.Main}>
      <div className={styles.pageTitle}><h1>My Projects</h1></div>
    
      <div className={styles.info}>
        {projects && ( 
            <div className={styles.achievements}>
              {Object.entries(projects).map(([projectId, project]) => (
                <div key={projectId} className={styles.achievementDetails}>
                  <InfoCard title={project.project_name} content={(
                    <table>
                      <tbody>
                        {keyOrder.map((key) => (
                          <tr key={key}>
                            <td><strong>{key.charAt(0).toUpperCase()+key.slice(1).replace(/_/g, ' ')}</strong></td>
                            <td>:</td>
                            <td>{key.includes('date') ? formatDate(project[key]) : project[key]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}/>
                </div>
              ))}
            </div>
          
        )}
      </div>
    </div>
  );
};

export default StudentProjects;
