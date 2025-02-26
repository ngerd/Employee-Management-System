import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './page/Login';
import AdminDashboard from './page/AdminDashboard';
import Project from './page/Project';
import CreateProject from './page/CreateProject';
import Home from './page/Home';
import ProjectDetail from './page/ProjectDetail';
import Navbar from './component/Navbar';
import CreateEmployee from './page/CreateEmployee';


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/project" element={<Project />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project-detail" element={<ProjectDetail />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

