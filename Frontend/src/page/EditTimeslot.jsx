import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";


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
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.CONTAINS },
    month: { value: null, matchMode: FilterMatchMode.CONTAINS },
    year: { value: null, matchMode: FilterMatchMode.CONTAINS },
    project_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    task_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    // New filter for Employee Name: We'll combine firstname and lastname in the filter function.
    employeeName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      date: { value: null, matchMode: FilterMatchMode.CONTAINS },
      month: { value: null, matchMode: FilterMatchMode.CONTAINS },
      year: { value: null, matchMode: FilterMatchMode.CONTAINS },
      project_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      task_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      employeeName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
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

  // Download function (unchanged from previous version)
  const exportToExcel = () => {
    if (tasks.length === 0) {
      alert("No timeslots to export!");
      return;
    }
    const filteredTasks = tasks.filter((task) => {
      // Apply each filter (except global) on the respective fields.
      const filterFields = [
        "date",
        "month",
        "year",
        "project_name",
        "task_name",
      ];
      const employeeFilter = filters.employeeName?.value;
      let matches = filterFields.every((col) => {
        const filterVal = filters[col]?.value;
        if (!filterVal) return true;
        const taskValue = task[col];
        if (taskValue === null || taskValue === undefined) return false;
        return taskValue
          .toString()
          .toLowerCase()
          .includes(filterVal.toString().toLowerCase());
      });
      // Additionally check employee name by combining firstname and lastname.
      if (employeeFilter) {
        const fullName = `${task.firstname} ${task.lastname}`.toLowerCase();
        matches =
          matches && fullName.includes(employeeFilter.toString().toLowerCase());
      }
      return matches;
    });

    if (filteredTasks.length === 0) {
      alert("No timeslots to export!");
      return;
    }
    // Map tasks to only include desired columns
    const exportData = filteredTasks.map((task) => ({
      Date: task.date,
      Month: task.month,
      Year: task.year,
      "Duration (hr)": task.duration ? task.duration.toFixed(2) : "",
      "Project Name": task.project_name,
      "Task Name": task.task_name,
      "Employee Name": `${task.firstname} ${task.lastname}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timeslots");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    // Use first task's employee name for file naming; fallback to "Employee" if no tasks
    const employeeName =
      tasks.length > 0
        ? `${tasks[0].firstname} ${tasks[0].lastname}`
        : "Employee";

    // Build file name suffix from active filters
    const filterColumns = [
      "date",
      "month",
      "year",
      "project_name",
      "task_name",
      "employeeName",
    ];
    const filterParts = [];
    filterColumns.forEach((col) => {
      const filterVal = filters[col]?.value;
      if (filterVal) {
        const colLabel =
          col === "employeeName"
            ? "Employee"
            : col.charAt(0).toUpperCase() + col.slice(1);
        filterParts.push(`${colLabel} ${filterVal}`);
      }
    });
    const filterSuffix = filterParts.join(" ");
    const fileName = filterSuffix
      ? `Timesheet ${employeeName} ${filterSuffix}.xlsx`
      : `Timesheet ${employeeName}.xlsx`;
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, fileName);
  };

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Header with title, filter bar, and download button */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-4xl font-bold text-gray-900">Edit Time Schedule</h1>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="h-10"
          outlined
          onClick={clearFilter}
        />
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
            onClick={exportToExcel}
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* DataTable with new columns, filters, sortable enabled and onFilter handler */}
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
        onFilter={(e) => setFilters(e.filters)}
        globalFilterFields={[
          "date",
          "month",
          "year",
          "project_name",
          "task_name",
          "firstname", // for global search on employee name
          "lastname",
        ]}
        filterDisplay="menu"
      >
        {/* <Column field="assignment_id" header="ID" style={{ minWidth: "5rem" }} sortable /> */}
        <Column
          field="date"
          header="Date"
          style={{ minWidth: "3rem" }}
          filter
          filterPlaceholder="Search Date"
          sortable
          headerStyle={{ textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="month"
          header="Month"
          style={{ minWidth: "3rem" }}
          filter
          filterPlaceholder="Search Month"
          sortable
          headerStyle={{ textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="year"
          header="Year"
          style={{ minWidth: "3rem" }}
          filter
          filterPlaceholder="Search Year"
          sortable
          headerStyle={{ textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="duration"
          header="Hours worked"
          body={(rowData) => formatDuration(rowData.duration)}
          style={{ minWidth: "7rem" }}
          headerStyle={{ textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="project_name"
          header="Project Name"
          style={{ minWidth: "10rem" }}
          filter
          filterPlaceholder="Search Project"
        />
        <Column
          field="task_name"
          header="Task Name"
          style={{ minWidth: "12rem" }}
          filter
          filterPlaceholder="Search Task"
        />
        <Column
          header="Employee Name"
          body={(rowData) => `${rowData.firstname} ${rowData.lastname}`}
          style={{ minWidth: "12rem" }}
          filter
          filterPlaceholder="Search Employee"
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
