import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker"; // Import DatePicker
import { SharedUserContext } from "../UserContextShare";
import "react-datepicker/dist/react-datepicker.css"; // Import styles for DatePicker
import styles from './MentorProjects.module.css';

const MentorProfile = () => {
  const { sharedUserData } = useContext(SharedUserContext);
  const [studentData, setStudentData] = useState(sharedUserData);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectStudents, setProjectStudents] = useState([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [newProjectData, setNewProjectData] = useState({
    project_name: "",
    start_date: new Date(), // Initialize with current date
    end_date: new Date() // Initialize with current date
  });
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setStudentData(JSON.parse(storedData));
    }
    
    // Fetch projects from backend using Axios
    axios.get('http://127.0.0.1:5000/api/v1/mentor/projects')
      .then(response => {
        const formattedProjects = response.data.response.map(project => {
          return [
            project[0],
            project[1],
            new Date(project[2]).toLocaleDateString(), // Convert start date to a formatted string
            new Date(project[3]).toLocaleDateString(), // Convert end date to a formatted string
            project[4],
            new Date(project[5]).toLocaleDateString() // Convert creation date to a formatted string
          ];
        });
        setProjects(formattedProjects);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedProject) {
      // Fetch students assigned to the selected project
      axios.post('http://127.0.0.1:5000/api/v1/mentor/projects/students', {
        project_id: selectedProject[0]
      })
      .then(response => {
        setProjectStudents(response.data.response);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
    }
  }, [selectedProject]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);

    // Fetch students assigned to the selected project
    axios.post('http://127.0.0.1:5000/api/v1/mentor/projects/students', {
      project_id: project[0]
    })
    .then(response => {
      setProjectStudents(response.data.response);
    })
    .catch(error => {
      console.error('Error fetching students:', error);
    });
  };

  const handleClearSelection = () => {
    setSelectedProject(null);
  };

  const handleAddStudent = () => {
    // Add new student to the selected project
    axios.post('http://127.0.0.1:5000/api/v1/mentor/projects/addStudent', {
      student_id: newStudentId,
      project_id: selectedProject[0]
    })
    .then(response => {
      const newStudentData = response.data.student_data[0];
      // Update project students after successful addition
      setProjectStudents(prevStudents => [
        ...prevStudents,
        newStudentData
      ]);
      // Clear the new student ID input field
      setNewStudentId("");
    })
    .catch(error => {
      console.error('Error adding student:', error);
    });
  };
  
  const handleRemoveStudent = (studentId) => {
    // Remove student from the selected project
    axios.delete('http://127.0.0.1:5000/api/v1/mentor/projects/removeStudent', {
      data: {
        student_id: studentId,
        project_id: selectedProject[0]
      }
    })
    .then(response => {
      // Update project students after successful removal
      setProjectStudents(projectStudents.filter(student => student[0] !== studentId));
    })
    .catch(error => {
      console.error('Error removing student:', error);
    });
  };

  const handleInputChange = (name, value) => {
    setNewProjectData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddProject = () => {
    // Add new project
    axios.post('http://127.0.0.1:5000/api/v1/mentor/addProject', newProjectData)
    .then(response => {
      // Update projects after successful addition
      setProjects([...projects, [response.data.project_id,newProjectData.project_name]]);
      console.log(newProjectData);
      // Clear the new project form inputs
      setNewProjectData({
        project_name: "",
        start_date: new Date(),
        end_date: new Date()
      });
      // Hide the add project form
      setShowAddProjectForm(false);
    })
    .catch(error => {
      console.error('Error adding project:', error);
    });
  };

  const handleRemoveProject = (projectId) => {
    // Remove project
    axios.delete('http://127.0.0.1:5000/api/v1/mentor/removeProject', {
      data: {
        project_id: projectId
      }
    })
    .then(response => {
      // Update projects after successful removal
      setProjects(projects.filter(project => project[0] !== projectId));
      setSelectedProject(null); // Clear selected project if removed
    })
    .catch(error => {
      console.error('Error removing project:', error);
    });
  };

  return (
    <div className={styles.mainContainer}>
      <h1>Projects</h1>
      <div className={styles.infoContainer}>
        {selectedProject ? (
          <div className={`${styles['mentor-project-card']} ${styles.expanded}`}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '0px' }}>
              {selectedProject[1]}
              <span style={{ cursor: 'pointer', fontSize: '45px' }} className="material-symbols-outlined" onClick={handleClearSelection}>close</span>
            </h3>
            <p>Start Date: {selectedProject[2]}</p>
            <p>End Date: {selectedProject[3]}</p>
            <h4 className={styles['mentor-h4']}>Students</h4>

            {projectStudents && projectStudents.map(student => (
            <div key={student && student[0]} style={{width:'100%'}}>
              {student && Array.isArray(student) && student.length >= 4 ? (
                <p style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <span>● &nbsp; {student[0]} : {student[1]} {student[2]} {student[3]}</span>
                <button className={styles['mentor-btn']} style={{ marginLeft: 'auto' }} onClick={() => handleRemoveStudent(student[0])}>Remove</button>
              </p>
          
              
              ) : (
                <p>Error: Invalid student data</p>
              )} 
              
            </div>
          ))}<p style={{display:'flex',justifyContent:'center'}}>---------------</p>
   <h4 className={styles['mentor-h4']}>Add Students</h4>
            <div style={{display:'flex', gap:'2%', marginBottom:'4%',width:'100%'}}>
           
              <input
                type="text"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
                placeholder="Enter Student ID"
              />
              <button className={styles['mentor-btn']} onClick={handleAddStudent}>Add</button>
            </div>
            <button className={styles['mentor-delete-btn']} onClick={() => handleRemoveProject(selectedProject[0])}>Delete Project</button>
          </div>
        ) : (
          projects.map(project => (
            <div 
              key={project[0]} 
              className={styles['mentor-project-card']} 
              onClick={() => handleProjectClick(project)}
            >
              <h3 style={{color:'rgb(49, 49, 49)'}}>{project[0]} : {project[1]}</h3>
            </div>
          ))
        )}
        {!selectedProject && !showAddProjectForm && (
          <div className={styles['mentor-project-card']} onClick={() => setShowAddProjectForm(true)}>
            <span 
              className="material-symbols-outlined" 
              style={{ color: 'grey', fontSize: '600%', cursor: 'pointer' }} 
              
            >
              add
            </span>
          </div>
        )}
        {showAddProjectForm && (
          <div className={`${styles['mentor-project-card']} ${styles.expanded}`}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '0px' }}>Add new project <span 
                style={{ cursor: 'pointer', fontSize: '45px', marginLeft: 'auto' }} 
                className="material-symbols-outlined" 
                onClick={() => setShowAddProjectForm(false)}
              >
                close
              </span></h3>
            <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', columnGap:'5px', rowGap:'10px'}}>
              <input
                type="text"
                name="project_name"
                value={newProjectData.project_name}
                onChange={(e) => handleInputChange("project_name", e.target.value)}
                placeholder="Project Name"
              />
              <DatePicker // Use DatePicker for start date
                selected={newProjectData.start_date}
                onChange={(date) => handleInputChange("start_date", date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Start Date (DD/MM/YYYY)"
                style={{width:'100%'}}
              />
              <DatePicker // Use DatePicker for end date
                selected={newProjectData.end_date}
                onChange={(date) => handleInputChange("end_date", date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="End Date (DD/MM/YYYY)"
              />
              <button className={styles['mentor-btn']} style={{width:'100%'}} onClick={handleAddProject}>Add</button>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorProfile;
