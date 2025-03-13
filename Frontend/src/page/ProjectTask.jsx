import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Info, ClipboardList, Users, CirclePlus, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { ProjectContext, Employee, TaskContext } from "../context/ContextProvider";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProjectTask = () => {
  const navigate = useNavigate();
  const { currentTaskId, setCurrentTaskId } = useContext(TaskContext);
  const { projectId } = useContext(ProjectContext);
  const { employeeId } = useContext(Employee);

  const [employees, setEmployees] = useState([]);
  const [isUserManager, setIsUserManager] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if the current user is the manager for this project
  useEffect(() => {
    const checkIfManager = async () => {
      if (!projectId || !employeeId) return;

      const result = await isManager(projectId, employeeId);
      console.log("Manager check result:", result);
      setIsUserManager(result);
    };

    checkIfManager();
  }, [projectId, employeeId]);

  const isManager = async (projectId, employeeId) => {
    try {
      const response = await fetch(`${backendUrl}/projects/checkmanager`, {
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

  const fetchTasks = async () => {
    console.log("Project ID for tasks:", projectId);
    if (!projectId) return;
    try {
      const response = await fetch(`${backendUrl}/task/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${backendUrl}/task/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const actionButtonTemplate = (rowData) => (
    <div className="flex gap-2">
      <button
        onClick={() => {
          setCurrentTaskId(rowData.task_id);
          console.log("Task ID:" + rowData.task_id);
          navigate("/update-task");
        }}
        className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
      >
        Update
      </button>

      <button
        onClick={() => handleDelete(rowData.task_id)}
        className="cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-500"
      >
        Delete
      </button>
    </div>
  );

  // Download task list to Excel
  const exportToExcel = () => {
    if (tasks.length === 0) {
      alert("No tasks to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    // Export and save
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Project_Tasks.xlsx");
  };

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Project Tasks
        </h1>
        <div className="flex gap-2">
          {isUserManager && (
            <button
              className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
              onClick={() => navigate("/add-task")}
            >
              <CirclePlus className="w-5 h-5" /> Add Task
            </button>
          )}
          <button
            className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
            onClick={exportToExcel}
          >
            <Download className="w-5 h-5" /> Download
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
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600 bg-white"
              >
                <ClipboardList size={16} /> Tasks
              </a>
              <a
                href="project-team"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100"
              >
                <Users size={16} /> Teams
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        value={tasks}
        paginator
        rows={10}
        loading={loading}
        dataKey="task_id"
        emptyMessage="No tasks found."
        showGridlines
        className="border border-gray-300 bg-white"
      >
        {/* <Column field="task_id" header="ID" style={{ minWidth: "5rem" }} /> */}
        <Column field="task_name" header="Task Name" style={{ minWidth: "12rem" }} />
        <Column
          field="start_date"
          header="Start Date"
          body={(rowData) => formatDate(rowData.start_date)}
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="due_date"
          header="Due Date"
          body={(rowData) => formatDate(rowData.due_date)}
          style={{ minWidth: "10rem" }}
        />
        <Column field="task_status" header="Status" style={{ minWidth: "10rem" }} />
        {isUserManager && (
          <Column
            header="Action"
            body={actionButtonTemplate}
            style={{ minWidth: "12rem" }}
          />
        )}
      </DataTable>
    </div>
  );
};

export default ProjectTask;
