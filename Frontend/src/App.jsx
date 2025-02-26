import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateAccount from './page/CreateAccount';
import AdminDashboard from './page/AdminDashboard';
import Project from './page/Project';
import CreateProject from './page/CreateProject';
import Home from './page/Home';
import ProjectDetail from './page/ProjectDetail';
import Navbar from './component/Navbar';
import Login from "./page/Login";
import Timesheet from "./page/Timesheet";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/project" element={<Project />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project-detail" element={<ProjectDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/timesheet" element={<Timesheet />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

