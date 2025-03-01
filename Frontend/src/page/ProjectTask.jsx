import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Info, ClipboardList, Users, CirclePlus, Download } from "lucide-react"; // Importing icons

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ProjectTask = () => {
  const navigate = useNavigate();
  const projectId = 1; // Set the project ID to 1

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/task/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was a problem fetching the tasks:", error);
    }
  };

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const data = await fetchTasks();
      setTasks(data);
      setLoading(false);
    }
    init();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch("http://localhost:3000/task/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });
      const data = await response.json();
      console.log(data);
      // Refresh the task list after deletion
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("There was a problem deleting the task:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle cases where the date might be null/undefined

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date); // Format as DD/MM/YYYY
  };

  // Action Buttons Column
  const actionButtonTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/update-task/${rowData.task_id}`)}
          className="inline-block rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(rowData.task_id)}
          className="inline-block rounded-md bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-500"
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Project Tasks
        </h1>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
            onClick={() => navigate("/add-task")}
          >
            <CirclePlus className="w-5 h-5" /> Add Task
          </button>
          <button
            className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
            onClick={() => navigate("#")}
          >
            <Download className="w-5 h-5" /> Download
          </button>
        </div>
      </div>

      <div className="mt-4">
        {/* Mobile Dropdown */}
        <div className="sm:hidden">
          <label htmlFor="Tab" className="sr-only">
            Tab
          </label>
          <select id="Tab" className="w-full rounded-md border-gray-200">
            <option>Information</option>
            <option>Tasks</option>
            <option>Teams</option>
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-1">
              {/* Information Tab */}
              <a
                href="project-information"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100"
              >
                <Info size={16} /> Information
              </a>

              {/* Tasks Tab (Active) */}
              <a
                href="project-task"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600 bg-white"
              >
                <ClipboardList size={16} /> Tasks
              </a>

              {/* Teams Tab */}
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
        <Column field="task_id" header="ID" style={{ minWidth: "5rem" }} />
        <Column
          field="task_name"
          header="Task Name"
          style={{ minWidth: "12rem" }}
        />
        <Column field="start_date" header="Start Date" body={(rowData) => formatDate(rowData.start_date)} style={{ minWidth: '10rem' }} />
        <Column field="due_date" header="Due Date" body={(rowData) => formatDate(rowData.due_date)} style={{ minWidth: '10rem' }} />
        <Column
          field="task_status"
          header="Status"
          style={{ minWidth: "10rem" }}
        />
        <Column header="Action" body={actionButtonTemplate} style={{ minWidth: "12rem" }} />
      </DataTable>
    </div>
  );
};

export default ProjectTask;
