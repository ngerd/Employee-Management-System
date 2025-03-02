import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CirclePlus } from "lucide-react";
import { ProjectContext } from "../context/ContextProvider";

const ProjectTeam = () => {
  const navigate = useNavigate();
  const { projectId } = useContext(ProjectContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    fetchTeam();
  }, [projectId]);

  // Fetch project team members
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

  // Open modal and fetch tasks
  const openAssignModal = async () => {
    console.log("Fetching tasks for project:", projectId);
    if (!projectId) return;

    try {
      const requestBody = JSON.stringify({ projectId: String(projectId) });
      console.log("Request body:", requestBody);

      const response = await fetch("http://localhost:3000/task/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      console.log("Response status:", response.status);
      const text = await response.text();
      console.log("Raw response:", text);

      const data = JSON.parse(text);
      console.log("Tasks received:", data);

      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }

    setIsModalOpen(true);
  };

  // Close modal
  const closeAssignModal = () => setIsModalOpen(false);

  // Remove an employee from the project
  const handleDelete = async (employee_id) => {
    try {
      const response = await fetch("http://localhost:3000/projects/delete-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id, project_id: projectId }),
      });

      if (!response.ok) throw new Error("Failed to delete employee");
      alert("Deleted successfully!");
      fetchTeam();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Action buttons for employee table
  const actionButtonTemplate = (rowData) => (
    <div className="flex gap-2">
      <button onClick={openAssignModal} className="bg-teal-600 px-4 py-2 text-white rounded-md hover:bg-teal-500">
        Assign
      </button>
      <button onClick={() => handleDelete(rowData.employee_id)} className="bg-orange-600 px-4 py-2 text-white rounded-md hover:bg-orange-500">
        Delete
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Project Teams</h1>
        <button onClick={() => navigate("/add-member")} className="bg-green-700 px-4 py-2 text-white rounded-md hover:bg-green-500 flex items-center gap-2">
          <CirclePlus className="w-5 h-5" /> Add Member
        </button>
      </div>

      {/* Employee Table */}
      <DataTable value={employees} paginator rows={10} loading={loading} dataKey="employee_id" emptyMessage="No employees found." showGridlines className="border border-gray-300 bg-white">
        <Column field="employee_id" header="ID" style={{ minWidth: "5rem" }} />
        <Column field="firstname" header="First Name" style={{ minWidth: "12rem" }} />
        <Column field="lastname" header="Last Name" style={{ minWidth: "12rem" }} />
        <Column field="email" header="Email" style={{ minWidth: "18rem" }} />
        <Column field="role_name" header="Role" style={{ minWidth: "10rem" }} />
        <Column header="Action" body={actionButtonTemplate} style={{ minWidth: "12rem" }} />
      </DataTable>

      {/* Assign Task Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40rem]">
            <h2 className="text-xl font-bold mb-4">Assign Task</h2>

            {/* PrimeReact Table */}
            <DataTable value={tasks} paginator rows={5} emptyMessage="No tasks found.">
              <Column field="task_id" header="Task ID" />
              <Column field="task_name" header="Task Name" />
            </DataTable>

            <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700" onClick={closeAssignModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTeam;
