import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Info, ClipboardList, Users, CirclePlus, Download } from "lucide-react"; // Importing icons

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ProjectTeam = () => {
  const navigate = useNavigate();
  const projectId = 1; // Set the project ID to 1

  // const fetchTeam = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/projects/info", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ projectId }),
  //     });
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("There was a problem fetching the tasks:", error);
  //   }
  // };

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("http://localhost:3000/projects/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
        });
        const data = await response.json();

        if (data && data.employees) {
          setEmployees(data.employees);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);


  // // View Button Column
  // const viewButtonTemplate = (rowData) => {
  //   return (
  //     <button
  //       onClick={() => navigate(`/project-detail/${rowData.project_id}`)}
  //       className="inline-block rounded-md bg-green-700 px-4 py-2 text-xs font-medium text-white hover:bg-green-500"
  //     >
  //       View
  //     </button>
  //   );
  // };


  const handleDelete = async (employee_id) => {
    try {
      const response = await fetch("http://localhost:3000/projects/delete-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id, project_id: projectId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete employee");
      }
      alert("Deleted successfully!");
      // Refresh the task list after deletion
      const updatedTeam = await fetchTeam();
      setEmployees(updatedTeam);
    } catch (error) {
      console.error("There was a problem deleting the task:", error);
    }
  };

  // Action Buttons Column
  const actionButtonTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/update-task/${rowData.task_id}`)}
          className="inline-block rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
        >
          Update
        </button>
        <button
          onClick={() => handleDelete(rowData.employee_id)}
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
            onClick={() => navigate("/add-member")}
          >
            <CirclePlus className="w-5 h-5" /> Add Member
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
              {/* Information Tab (Active) */}
              <a
                href="project-information"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100"
              >
                <Info size={16} /> Information
              </a>

              {/* Tasks Tab */}
              <a
                href="project-task"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100"
              >
                <ClipboardList size={16} /> Tasks
              </a>

              {/* Teams Tab */}
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

    </div>
  );
};

export default ProjectTeam;
