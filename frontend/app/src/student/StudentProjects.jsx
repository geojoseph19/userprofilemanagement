import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Projects.module.css';
import InfoCard from '../InfoCard';

const StudentProjects = () => {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/student/project');
        setProjects(response.data.response);
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
    'project_name',
    'project_id',
    'start_date',
    'end_date',
    'mentor_id',
    'mentor_in-charge',
  ];

  return (
    <div className={styles.Main}>
      <div className="pageTitle"><h1>My Projects</h1></div>
      <div className={styles.info}>
        {projects && (
          <div className={styles.projectPanel}>
            <div className={styles.projectDetails}>
              <table>
                <tbody>
                  {Object.entries(projects).map(([projectId, project]) => (
                    <React.Fragment key={projectId}>
                      <InfoCard title={project.project_name} content={(
                        <>
                          {keyOrder.map((key) => (
                            key !== 'project_name' && (
                              <React.Fragment key={key}>
                                <p><strong>{key.charAt(0).toUpperCase()+key.slice(1).replace(/_/g, ' ')}</strong>: {key.includes('date') ? formatDate(project[key]) : project[key]}</p>
                              </React.Fragment>
                            )
                          ))}
                        </>
                      )} />
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProjects;
