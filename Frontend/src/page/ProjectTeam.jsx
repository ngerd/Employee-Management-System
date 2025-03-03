import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Info, ClipboardList, Users, CirclePlus } from "lucide-react";
import { ProjectContext } from '../context/ContextProvider';

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

  const openAssignModal = async () => {

    if (!projectId) return;
    try {
      const response = await fetch("http://localhost:3000/task/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      console.log("Tasks received:", data);

      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setIsModalOpen(true);
  };


  const closeAssignModal = () => setIsModalOpen(false);

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

  const actionButtonTemplate = (rowData) => (
    <div className="flex gap-2">
      <button onClick={openAssignModal} className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
      >
        Assign
      </button>
      <button onClick={() => handleDelete(rowData.employee_id)} className="cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-500">
        Delete
      </button>
    </div>
  );

  const assigntask = (rowData) => (
    <div className="flex gap-2">
      <button className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
      >
        Select
      </button>
      {/* <button onClick={() => handleDelete(rowData.employee_id)} className="cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-500">
        Unassign
      </button> */}
    </div>
  );




  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Project Teams
        </h1>
        <div className="flex gap-2">
          <button
            className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
            onClick={() => navigate("/add-member")}
          >
            <CirclePlus className="w-5 h-5" /> Add Member
          </button>
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

      {/* DataTable */}
      <DataTable
        value={employees}
        paginator
        rows={10}
        loading={loading}
        dataKey="employee_id"
        emptyMessage="No employees found."
        showGridlines
        className="border border-gray-300 bg-white"
      >
        <Column field="employee_id" header="ID" style={{ minWidth: "5rem" }} />
        <Column field="firstname" header="First Name" style={{ minWidth: "12rem" }} />
        <Column field="lastname" header="Last Name" style={{ minWidth: "12rem" }} />
        <Column field="email" header="Email" style={{ minWidth: "18rem" }} />
        <Column field="role_name" header="Role" style={{ minWidth: "10rem" }} />
        <Column header="Action" body={actionButtonTemplate} style={{ minWidth: "12rem" }} />
      </DataTable>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-300 w-[40rem]">
            <h2 className="text-xl font-bold mb-4">Assign Task</h2>

            <DataTable value={tasks} paginator rows={5} emptyMessage="No tasks found.">
              <Column field="task_id" header="Task ID" />
              <Column field="task_name" header="Task Name" />
              <Column header="Action" body={assigntask} />
            </DataTable>

            <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700" onClick={closeAssignModal}>Close</button>
          </div>
        </div>
      )}


    </div>
  );
};

export default ProjectTeam;
