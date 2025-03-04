import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Info, ClipboardList, Users, CirclePlus } from "lucide-react";
import { ProjectContext, Employee } from "../context/ContextProvider";

const ProjectTeam = () => {
  const navigate = useNavigate();
  const { projectId } = useContext(ProjectContext);
  const { employeeId } = useContext(Employee);

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignedTaskIds, setAssignedTaskIds] = useState(new Set()); // Store assigned tasks
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserManager, setIsUserManager] = useState();

  useEffect(() => {
    const checkIfManager = async () => {
      if (!projectId || !employeeId) return;

      const result = await isManager(projectId, employeeId);
      console.log("result" + result)
      setIsUserManager(result);
    };

    checkIfManager();
  }, [projectId, employeeId]);


  useEffect(() => {
    if (!projectId) return;
    fetchTeam();
  }, [projectId]);


  const isManager = async (projectId, employeeId) => {
    try {
      const response = await fetch("http://localhost:3000/projects/checkmanager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) throw new Error("Failed to fetch manager");

      const data1 = await response.json();
      console.log("Data received:", JSON.stringify(data1, null, 2));
      console.log("Employee ID:", employeeId);

      if (!data1.manager) {
        console.log("No manager assigned to this project.");
        return false;
      }

      console.log("Comparison result:", Number(data1.manager) === Number(employeeId));
      return Number(data1.manager) === Number(employeeId);

    } catch (error) {
      console.error("Error checking manager:", error);
      return false;
    }
  };




  // Fetch employees
  const fetchTeam = async () => {
    try {
      const response = await fetch("http://localhost:3000/projects/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (!response.ok) throw new Error("Failed to fetch team data");
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal and fetch tasks + assigned tasks
  const openAssignModal = async (employeeId) => {
    setSelectedEmployeeId(employeeId); // Store selected employee ID

    if (!projectId || !employeeId) return;

    try {
      // Get all available tasks
      const taskResponse = await fetch("http://localhost:3000/task/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!taskResponse.ok) throw new Error("Failed to fetch tasks");
      const taskData = await taskResponse.json();
      setTasks(taskData || []);


      console.log("Fetching:", "http://localhost:3000/task/getEmployeeTask");
      console.log("Payload:", { employee_id: employeeId });


      // Get assigned tasks for the employee
      const assignedResponse = await fetch("http://localhost:3000/task/getEmployeeTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId }),
      });

      if (!assignedResponse.ok) throw new Error("Failed to fetch assigned tasks");
      const assignedData = await assignedResponse.json();

      // Extract assigned task IDs and store in Set for fast lookup
      const assignedIds = new Set(assignedData.map((task) => task.task_id));
      setAssignedTaskIds(assignedIds);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }

    setIsModalOpen(true);
  };

  // Close modal
  // const closeAssignModal = () => setIsModalOpen(false);

  const closeAssignModal = () => {
    setIsModalOpen(false);
    fetchTeam(); // Re-fetch team data
  };


  // API call to assign or unassign task
  const toggleTaskAssignment = async (taskId) => {
    if (!selectedEmployeeId || !taskId) return;

    const isAssigned = assignedTaskIds.has(taskId);
    const endpoint = isAssigned ? "/unassign" : "/assign"; // Change API based on current state

    try {
      const response = await fetch(`http://localhost:3000/task${endpoint}`, {
        method: isAssigned ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedEmployeeId, taskId }),
      });

      const text = await response.text();
      console.log("Raw Response:", text);

      const data = JSON.parse(text);
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isAssigned ? "unassign" : "assign"} task`);
      }

      alert(`Task ${isAssigned ? "unassigned" : "assigned"} successfully!`);

      // Update the assigned tasks list
      setAssignedTaskIds((prev) => {
        const newSet = new Set(prev);
        if (isAssigned) {
          newSet.delete(taskId); // Remove from assigned list
        } else {
          newSet.add(taskId); // Add to assigned list
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  // Delete employee
  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch("http://localhost:3000/projects/delete-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId, project_id: projectId }),
      });
      if (!response.ok) throw new Error("Failed to delete employee");
      alert("Deleted successfully!");
      fetchTeam(); // Refresh employee list
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Action buttons for employees
  const actionButtonTemplate = (rowData) => (
    <div className="flex gap-2">
      <button
        onClick={() => openAssignModal(rowData.employee_id)}
        className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
      >
        Assign
      </button>
      <button
        onClick={() => handleDelete(rowData.employee_id)}
        className="cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-500"
      >
        Delete
      </button>
    </div>
  );

  // Assign/Unassign task button inside modal
  const assignTaskButton = (rowData) => {
    const isAssigned = assignedTaskIds.has(rowData.task_id);
    return (
      <button
        onClick={() => toggleTaskAssignment(rowData.task_id)}
        className={`cursor-pointer rounded-md px-4 py-2 text-xs font-medium text-white ${isAssigned ? "bg-red-600 hover:bg-red-500" : "bg-teal-600 hover:bg-teal-500"
          }`}
      >
        {isAssigned ? "Unselect" : "Select"}
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Project Teams
        </h1>
        <div className="flex gap-2">
          {isUserManager && (
            <button
              className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
              onClick={() => navigate("/add-member")}
            >
              <CirclePlus className="w-5 h-5" /> Add Member
            </button>
          )}

        </div>
      </div>

      <div className="mt-4">
        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-1">
              <a
                href="project-information"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100"
              >
                <Info size={16} /> Information
              </a>
              <a
                href="project-task"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100"
              >
                <ClipboardList size={16} /> Tasks
              </a>
              <a
                href="project-team"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600 bg-white"
              >
                <Users size={16} /> Teams
              </a>
            </nav>
          </div>
        </div>
      </div>
      {/* DataTable for Employees */}
      <DataTable value={employees} paginator rows={10} loading={loading} dataKey="employee_id" emptyMessage="No employees found.">
        <Column field="employee_id" header="ID" />
        <Column field="firstname" header="First Name" />
        <Column field="lastname" header="Last Name" />
        <Column field="email" header="Email" />
        <Column field="role_name" header="Role" />
        {isUserManager && <Column header="Action" body={actionButtonTemplate} />}

      </DataTable>

      {/* Assign Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Assign Task</h2>
            <DataTable value={tasks} paginator rows={5} emptyMessage="No tasks found.">
              <Column field="task_id" header="Task ID" />
              <Column field="task_name" header="Task Name" />
              <Column header="Action" body={assignTaskButton} />
            </DataTable>
            <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700" onClick={closeAssignModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTeam;
