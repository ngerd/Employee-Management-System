import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { ProjectContext, Employee } from "../context/ContextProvider";

// Helper: Convert numeric month to abbreviated name (e.g., 1 -> "Jan")
function getMonthName(monthNumber) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const index = Math.max(1, Math.min(12, Number(monthNumber))) - 1;
  return monthNames[index];
}

// Helper: Get the number of days in a month for a given year
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

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
    try {
      const response = await fetch("http://localhost:3000/getTimesheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    try {
      const response = await fetch("http://localhost:3000/deleteTimesheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Round worked hours to one decimal place
  const formatDuration = (duration) => (duration ? Number(duration).toFixed(1) : "");

  // Action buttons: update and delete
  const actionButtonTemplate = (rowData) => (
    <div className="flex gap-2" style={{ textAlign: "center" }}>
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

  /**
   * Custom Excel export:
   * - Splits the days of the chosen month into two side-by-side tables.
   * - Rows 0-2: Title, Employee name, and Project name.
   * - Row 3: Blank.
   * - Row 4: Headers for both tables (Left: Date, Hours worked, Remarks; Right: Date, Hours worked, Remarks).
   * - Data rows for the tables.
   * - Final row (only for table 2): Under table 2, merge columns E and F to show the label "Total days worked:" and put the computed value in column G.
   * - Header cells styled blue with white bold text; date cells with 0 worked hours are shaded gray.
   * - All columns in each table have fixed equal widths.
   */
  const exportToExcel = () => {
    // 1) Filter tasks based on current filters
    const filteredTasks = tasks.filter((task) => {
      const filterFields = ["date", "month", "year", "project_name", "task_name"];
      const employeeFilter = filters.employeeName?.value;
      let matches = filterFields.every((col) => {
        const filterVal = filters[col]?.value;
        if (!filterVal) return true;
        const taskValue = task[col];
        if (taskValue === null || taskValue === undefined) return false;
        return taskValue.toString().toLowerCase().includes(filterVal.toString().toLowerCase());
      });
      if (employeeFilter) {
        const fullName = `${task.firstname} ${task.lastname}`.toLowerCase();
        matches = matches && fullName.includes(employeeFilter.toLowerCase());
      }
      return matches;
    });
    if (filteredTasks.length === 0) {
      alert("No timeslots to export!");
      return;
    }

    // 2) Determine chosen month and year from filters; fallback to first record if not set.
    let chosenMonth = filters.month?.value || filteredTasks[0].month;
    let chosenYear = filters.year?.value || filteredTasks[0].year;
    const monthName = getMonthName(chosenMonth);
    const yearNum = Number(chosenYear);
    const monthNum = Number(chosenMonth);
    const lastDay = getDaysInMonth(monthNum, yearNum);

    // 3) Build summary maps: sum hours and collect remarks per day.
    const dayHoursMap = {};
    const dayRemarksMap = {};
    filteredTasks.forEach((task) => {
      const day = Number(task.date);
      const hours = Number(task.duration || 0);
      if (!dayHoursMap[day]) {
        dayHoursMap[day] = 0;
        dayRemarksMap[day] = [];
      }
      dayHoursMap[day] += hours;
      if (task.task_name) {
        dayRemarksMap[day].push(task.task_name);
      }
    });

    // 4) Split days into two side-by-side tables.
    const leftCount = Math.ceil(lastDay / 2);
    const rightCount = lastDay - leftCount;
    const maxRows = Math.max(leftCount, rightCount);

    // 5) Get employee info and project name (assuming all tasks are from the same project)
    const firstTask = filteredTasks[0];
    const employeeFullName = `${firstTask.firstname} ${firstTask.lastname}`;
    const projectName = firstTask.project_name;

    // 6) Build the array-of-arrays (AOA) layout.
    const aoa = [];
    // Row 0: Title (merged across A–G)
    aoa.push([`Billing Time Sheet for the month: ${monthName}`]);
    // Row 1: Employee name (to be merged across A–C)
    aoa.push([`Employee name: ${employeeFullName}`]);
    // Row 2: Project name (to be merged across A–C)
    aoa.push([`Project name: ${projectName}`]);
    // Row 3: Blank row for spacing
    aoa.push([]);
    // Row 4: Headers for both tables (Left: Date, Hours worked, Remarks; Right: Date, Hours worked, Remarks)
    aoa.push(["Date", "Hours worked", "Remarks", "", "Date", "Hours worked", "Remarks"]);
    // Data rows for each table
    for (let i = 0; i < maxRows; i++) {
      const leftDay = i < leftCount ? i + 1 : "";
      const leftHours = leftDay !== "" ? (dayHoursMap[leftDay] || 0) : "";
      const leftHoursRounded = leftDay !== "" ? Number(leftHours).toFixed(1) : "";
      const leftRemarks = leftDay !== "" ? (dayRemarksMap[leftDay] ? dayRemarksMap[leftDay].join(", ") : "") : "";
      const rightDay = i < rightCount ? i + leftCount + 1 : "";
      const rightHours = rightDay !== "" ? (dayHoursMap[rightDay] || 0) : "";
      const rightHoursRounded = rightDay !== "" ? Number(rightHours).toFixed(1) : "";
      const rightRemarks = rightDay !== "" ? (dayRemarksMap[rightDay] ? dayRemarksMap[rightDay].join(", ") : "") : "";
      aoa.push([leftDay, leftHoursRounded, leftRemarks, "", rightDay, rightHoursRounded, rightRemarks]);
    }
    // 7) Final row: Only for table 2 (right table)
    // For columns A-D, we insert blank cells.
    // For table 2, merge columns E and F to display the label, and column G will have the computed value.
    let totalHours = 0;
    for (let d = 1; d <= lastDay; d++) {
      totalHours += dayHoursMap[d] || 0;
    }
    const totalDaysWorked = (totalHours / 8).toFixed(1);
    aoa.push(["", "", "", "", "Total days worked:", "", totalDaysWorked]);

    // 8) Convert the AOA to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // 9) Define merges:
    ws["!merges"] = [
      // Merge title row (Row 0: columns A–G)
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
      // Merge Employee name row (Row 1: columns A–C)
      { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
      // Merge Project name row (Row 2: columns A–C)
      { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
      // Merge final row for table 2: merge columns E and F in the last row
      { s: { r: aoa.length - 1, c: 4 }, e: { r: aoa.length - 1, c: 5 } },
    ];

    // 10) Set fixed column widths: left table (columns A–C), spacer (D), right table (columns E–G)
    ws["!cols"] = [
      { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 2 },
      { wch: 12 }, { wch: 12 }, { wch: 12 },
    ];

    // 11) Apply cell styling:
    // Header row (Row 4) should be blue with white bold text.
    const headerRow = 4;
    [0, 1, 2, 4, 5, 6].forEach((col) => {
      const cellAddr = XLSX.utils.encode_cell({ r: headerRow, c: col });
      if (ws[cellAddr]) {
        ws[cellAddr].s = {
          fill: { fgColor: { rgb: "0000FF" } },
          font: { color: { rgb: "FFFFFF" }, bold: true },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });
    // For date cells (columns A and E in data rows), if corresponding worked hours equals 0, set background to gray.
    for (let i = headerRow + 1; i < headerRow + 1 + maxRows; i++) {
      // Left table: column 0
      const leftCellAddr = XLSX.utils.encode_cell({ r: i, c: 0 });
      const leftHoursAddr = XLSX.utils.encode_cell({ r: i, c: 1 });
      if (ws[leftCellAddr] && ws[leftHoursAddr] && Number(ws[leftHoursAddr].v) === 0) {
        ws[leftCellAddr].s = {
          fill: { fgColor: { rgb: "D3D3D3" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
      // Right table: column 4
      const rightCellAddr = XLSX.utils.encode_cell({ r: i, c: 4 });
      const rightHoursAddr = XLSX.utils.encode_cell({ r: i, c: 5 });
      if (ws[rightCellAddr] && ws[rightHoursAddr] && Number(ws[rightHoursAddr].v) === 0) {
        ws[rightCellAddr].s = {
          fill: { fgColor: { rgb: "D3D3D3" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }

    // 12) Create workbook and save file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const fileName = `Timesheet ${employeeFullName} ${monthName}.xlsx`;
    saveAs(dataBlob, fileName);
  };

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-4xl font-bold text-gray-900">Edit Time Schedule</h1>
      </div>
      {/* Filter & Download */}
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
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        globalFilterFields={[
          "date",
          "month",
          "year",
          "project_name",
          "task_name",
          "firstname",
          "lastname",
        ]}
        filterDisplay="menu"
      >
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
          sortable
          headerStyle={{ textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="project_name"
          header="Project Name"
          style={{ minWidth: "10rem" }}
          filter
          filterPlaceholder="Search Project"
          sortable
        />
        <Column
          field="task_name"
          header="Task Name"
          style={{ minWidth: "12rem" }}
          filter
          filterPlaceholder="Search Task"
          sortable
        />
        <Column
          header="Employee Name"
          body={(rowData) => `${rowData.firstname} ${rowData.lastname}`}
          style={{ minWidth: "12rem" }}
          filter
          filterPlaceholder="Search Employee"
          sortable
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
