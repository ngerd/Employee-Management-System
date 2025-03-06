import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import CreateProject2 from "./page/CreateProject2";
import AdminDashboard from "./page/AdminDashboard";
import Project from "./page/Project";
import CreateProject from "./page/CreateProject";
import Home from "./page/Home";
import ProjectDetail from "./page/ProjectDetail";
import Navbar from "./component/Navbar";
import Timesheet from "./page/Timesheet";
import Timesheet2 from "./page/Timesheet2";
import Login from "./page/Login";
import CreateEmployee from "./page/CreateEmployee";
import CreateTimeslot from "./page/CreateTimeslot";
import ProjectInformation from "./page/ProjectInformation";
import ProjectTask from "./page/ProjectTask";
import ProjectTeam from "./page/ProjectTeam";
import Staff from "./page/Staff";
import ContextProvider from "./context/ContextProvider";
import AddTask from "./page/AddTask";
import AddMember from "./page/AddMember";
import UpdateTask from "./page/UpdateTask";
import ViewEmployeeInfo from "./page/ViewEmployeeInfo";
import EditTimeslot from "./page/EditTimeslot";
import UpdateTimeslot from "./page/UpdateTimeslot";
import ViewAccountForStaff from "./page/ViewAccountForStaff";

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <ContextProvider>
        {location.pathname !== "/login" && <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/project" element={<Project />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/create-project2" element={<CreateProject2 />} />
          <Route path="/project-detail" element={<ProjectDetail />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
          <Route path="/home" element={<Home />} />
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/create-timeslot" element={<CreateTimeslot />} />
          <Route path="/project-information/" element={<ProjectInformation />} />
          <Route path="/project-task" element={<ProjectTask />} />
          <Route path="/project-team" element={<ProjectTeam />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/update-task" element={<UpdateTask />} />
          <Route path="/add-member" element={<AddMember />} />
          <Route path="/view-account" element={<ViewEmployeeInfo />} />
          <Route path="/view-account-for-staff" element={<ViewAccountForStaff />} />
          <Route path="/edit-timeslot" element={<EditTimeslot />} />
          <Route path="/timesheet2" element={<Timesheet2 />} />
          <Route path="/update-timeslot/:assignment_id" element={<UpdateTimeslot />} />

        </Routes>
      </ContextProvider>
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
