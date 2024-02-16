
import './App.css';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StudProjects from './components/StudProjects';
import Achievements from './components/Achievements';
import Login from './components/Login';
// import ProgressWheel from './components/Progresswheel';
// import Progresswheel from './components/Progresswheel'
// import Login from './components/Login'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
    <Navbar/>
    <Login/>
    {/* <h1>Student Dashboard</h1>
   <Router>
    <div>
      <Dashboard/>
      <Routes>
        <Route path='/assignedproj' element={<StudProjects />}/>
        <Route path='/awards' element={<Achievements/>}/>
      </Routes>
    </div>
   </Router> */}
    </>
  );
}

export default App;
