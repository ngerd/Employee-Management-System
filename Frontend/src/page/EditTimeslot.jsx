import React, { useState, useEffect, useContext } from "react"; // Thêm useContext
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { ProjectContext, Employee } from "../context/ContextProvider";

const EditTimeslot = () => {
  const navigate = useNavigate();
  const { projectId } = useContext(ProjectContext);
  const { employeeId } = useContext(Employee);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    console.log("Fetching timesheet for Employee ID:", employeeId);
    try {
      const response = await fetch("http://localhost:3000/getTimesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id: employeeId }),
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
  }, [employeeId]);

  const handleDelete = async (taskId) => {
    console.log("Task ID: " + taskId);
    const requestBody = JSON.stringify({ assignment_id: taskId }); // Ensure correct structure
    console.log("Request Body:", requestBody); // Debugging log to verify structure
    try {
      const response = await fetch("http://localhost:3000/deleteTimesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignment_id: taskId }),
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
    if (!dateString) return "";

    const date = new Date(dateString);

    return (
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date) +
      " " +
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Ensures 24-hour format
      })
    );
  };

  const actionButtonTemplate = (rowData) => (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/update-timeslot/${rowData.assignment_id}`)}
        className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
      >
        Update
      </button>
      <button
        onClick={() => handleDelete(rowData.assignment_id)}
        className="cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-500"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Edit Time Schedule
        </h1>
      </div>

      {/* DataTable */}
      <DataTable
        value={tasks}
        paginator
        rows={10}
        loading={loading}
        dataKey="assignment_id"
        emptyMessage="No timeslots found."
        showGridlines
        className="border border-gray-300 bg-white mt-6"
      >
        <Column
          field="assignment_id"
          header="ID"
          style={{ minWidth: "5rem" }}
        />
        <Column
          field="project_name"
          header="Project Name"
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="task_name"
          header="Task Name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="emp_startdate"
          header="Start Date"
          body={(rowData) => formatDate(rowData.emp_startdate)}
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="emp_enddate"
          header="End Date"
          body={(rowData) => formatDate(rowData.emp_startdate)}
          style={{ minWidth: "10rem" }}
        />
        <Column
          header="Action"
          body={actionButtonTemplate}
          style={{ minWidth: "12rem" }}
        />
      </DataTable>
    </div>
  );
};

export default EditTimeslot;
