import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './page/Login';
import AdminDashboard from './page/AdminDashboard';
import Project from './page/Project';
import CreateProject from './page/CreateProject';
import Home from './page/Home';
import ProjectList from './page/ProjectList';
import ViewProject from './page/ViewProject';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/project" element={<Project />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/view-project" element={<ViewProject />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

