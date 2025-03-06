import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  // Filtering states
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  // Initialize filters for: date, month, year, project_name, task_name
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      date: { value: null, matchMode: FilterMatchMode.CONTAINS },
      month: { value: null, matchMode: FilterMatchMode.CONTAINS },
      year: { value: null, matchMode: FilterMatchMode.CONTAINS },
      project_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      task_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  useEffect(() => {
    initFilters();
  }, []);

  const clearFilter = () => {
    initFilters();
    setGlobalFilterValue("");
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    }));
    setGlobalFilterValue(value);
  };

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

  // Format duration to two decimals
  const formatDuration = (duration) => (duration ? duration.toFixed(2) : "");

  // Action buttons: update and delete
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

  // Download current tasks to Excel
  const exportToExcel = () => {
    if (tasks.length === 0) {
      alert("No timeslots to export!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timeslots");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Timeslots.xlsx");
  };

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Header with title, filter bar, and download button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Edit Time Schedule
        </h1>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            onClick={clearFilter}
          />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="pl-2 py-2 border rounded-md"
          />
          <Button
            type="button"
            icon="pi pi-download"
            label="Download"
            className="p-button-success"  // This sets the button to green
            onClick={exportToExcel}
          />
        </div>
      </div>

      {/* DataTable with new columns and filters */}
      <DataTable
        value={tasks}
        paginator
        rows={10}
        loading={loading}
        dataKey="assignment_id"
        emptyMessage="No timeslots found."
        showGridlines
        className="border border-gray-300 bg-white mt-6"
        filters={filters}
        globalFilterFields={[
          "date",
          "month",
          "year",
          "project_name",
          "task_name",
        ]}
        filterDisplay="menu"
      >
        <Column field="assignment_id" header="ID" style={{ minWidth: "5rem" }} />
        <Column field="date" header="Date" style={{ minWidth: "5rem" }} filter filterPlaceholder="Search Date" />
        <Column field="month" header="Month" style={{ minWidth: "5rem" }} filter filterPlaceholder="Search Month" />
        <Column field="year" header="Year" style={{ minWidth: "5rem" }} filter filterPlaceholder="Search Year" />
        <Column
          field="duration"
          header="Duration (hr)"
          body={(rowData) => formatDuration(rowData.duration)}
          style={{ minWidth: "10rem" }}
        />
        <Column field="project_name" header="Project Name" style={{ minWidth: "10rem" }} filter filterPlaceholder="Search Project" />
        <Column field="task_name" header="Task Name" style={{ minWidth: "12rem" }} filter filterPlaceholder="Search Task" />
        <Column
          header="Employee Name"
          body={(rowData) => `${rowData.firstname} ${rowData.lastname}`}
          style={{ minWidth: "12rem" }}
        />
        <Column header="Action" body={actionButtonTemplate} style={{ minWidth: "12rem" }} />
      </DataTable>
    </div>
  );
};

export default EditTimeslot;
