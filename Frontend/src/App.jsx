import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './page/Login';
import AdminDashboard from './page/AdminDashboard';
import Project from './page/Project';
import CreateProject from './page/CreateProject';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/project" element={<Project />} />
        <Route path="/create-project" element={<CreateProject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

