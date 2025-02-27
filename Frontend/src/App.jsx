import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminDashboard from './page/AdminDashboard';
import Project from './page/Project';
import CreateProject from './page/CreateProject';
import Home from './page/Home';
import ProjectDetail from './page/ProjectDetail';
import Navbar from './component/Navbar';
import Timesheet from "./page/Timesheet";
import Login from "./page/Login";
import CreateEmployee from './page/CreateEmployee';

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {location.pathname !== "/login" && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/project" element={<Project />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/project-detail" element={<ProjectDetail />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/home" element={<Home />} />
        <Route path="/timesheet" element={<Timesheet />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
