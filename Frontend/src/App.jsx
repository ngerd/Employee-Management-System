import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useContext } from "react";

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
import AddTask from "./page/AddTask";
import AddMember from "./page/AddMember";
import UpdateTask from "./page/UpdateTask";
import ViewEmployeeInfo from "./page/ViewEmployeeInfo";
import EditTimeslot from "./page/EditTimeslot";
import UpdateTimeslot from "./page/UpdateTimeslot";
import ViewAccountForStaff from "./page/ViewAccountForStaff";
import Customer from "./page/Customer";
import CustomerInformation from "./page/CustomerInformation";
import CustomerPayment from "./page/CustomerPayment";
import CreateCustomer from "./page/CreateCustomer";
import UpdateCustomer from "./page/UpdateCustomer";
import UpdateProject from "./page/UpdateProject";

import ContextProvider, { Employee } from "./context/ContextProvider";

// This component ensures that if employeeId is null, we redirect to login.
function ProtectedRoute({ children }) {
  const { employeeId } = useContext(Employee);
  if (employeeId == null) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Updated CheckAdmin component:
// If the user is not an admin (isadmin is false), it will redirect to "/home".
function CheckAdmin({ children }) {
  const { isadmin } = useContext(Employee);
  if (!isadmin) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

function Layout() {
  const location = useLocation();
  const { employeeId } = useContext(Employee);

  // If not logged in and not on /login, redirect immediately.
  if (employeeId == null && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {location.pathname !== "/login" && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/project" element={<ProtectedRoute><Project /></ProtectedRoute>} />
        <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/create-project2" element={<ProtectedRoute><CreateProject2 /></ProtectedRoute>} />
        <Route path="/project-detail" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/create-employee" element={<ProtectedRoute><CheckAdmin><CreateEmployee /></CheckAdmin></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/timesheet" element={<ProtectedRoute><Timesheet /></ProtectedRoute>} />
        <Route path="/create-timeslot" element={<ProtectedRoute><CreateTimeslot /></ProtectedRoute>} />
        <Route path="/project-information" element={<ProtectedRoute><ProjectInformation /></ProtectedRoute>} />
        <Route path="/project-task" element={<ProtectedRoute><ProjectTask /></ProtectedRoute>} />
        <Route path="/project-team" element={<ProtectedRoute><ProjectTeam /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><CheckAdmin><Staff /></CheckAdmin></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><CheckAdmin><AdminDashboard /></CheckAdmin></ProtectedRoute>} />
        <Route path="/add-task" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
        <Route path="/update-task" element={<ProtectedRoute><UpdateTask /></ProtectedRoute>} />
        <Route path="/add-member" element={<ProtectedRoute><AddMember /></ProtectedRoute>} />
        <Route path="/view-account" element={<ProtectedRoute><ViewEmployeeInfo /></ProtectedRoute>} />
        <Route path="/view-account-for-staff" element={<ProtectedRoute><ViewAccountForStaff /></ProtectedRoute>} />
        <Route path="/edit-timeslot" element={<ProtectedRoute><EditTimeslot /></ProtectedRoute>} />
        <Route path="/timesheet2" element={<ProtectedRoute><Timesheet2 /></ProtectedRoute>} />
        <Route path="/update-timeslot/:assignment_id" element={<ProtectedRoute><UpdateTimeslot /></ProtectedRoute>} />
        <Route path="/customer" element={<ProtectedRoute><CheckAdmin><Customer /></CheckAdmin></ProtectedRoute>} />
        <Route path="/customer-information" element={<ProtectedRoute><CheckAdmin><CustomerInformation /></CheckAdmin></ProtectedRoute>} />
        <Route path="/customer-payment" element={<ProtectedRoute><CheckAdmin><CustomerPayment /></CheckAdmin></ProtectedRoute>} />
        <Route path="/create-customer" element={<ProtectedRoute><CheckAdmin><CreateCustomer /></CheckAdmin></ProtectedRoute>} />
        <Route path="/update-customer" element={<ProtectedRoute><CheckAdmin><UpdateCustomer /></CheckAdmin></ProtectedRoute>} />
        <Route path="/update-project" element={<ProtectedRoute><UpdateProject /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
