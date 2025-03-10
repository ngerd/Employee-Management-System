import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, ClipboardList, Users } from "lucide-react"; // Importing icons
import { ProjectContext } from "../context/ContextProvider";

const ProjectInformation = () => {
  const navigate = useNavigate();
  const { projectId } = useContext(ProjectContext);
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle cases where the date might be null/undefined

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date); // Format as DD/MM/YYYY
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/projects/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
        });

        const data = await response.json();
        setProject(data.project);
        setEmployees(data.employees);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    console.log("Project ID: " + projectId)

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Project Information
        </h1>
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
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600 bg-white"
              >
                <Info size={16} /> Information
              </a>

              {/* Tasks Tab */}
              <a
                href="project-task"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100"
              >
                <ClipboardList size={16} /> Tasks
              </a>

              {/* Teams Tab */}
              <a
                href="project-team"
                className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100"
              >
                <Users size={16} /> Teams
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="flow-root rounded-b-lg border border-gray-300 py-3 shadow-xs bg-white">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Project Name</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {project ? project.project_name : "N/A"}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Project Description</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {project ? project.project_description : "N/A"}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Start Date</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {project ? formatDate(project.start_date) : "N/A"}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Due Date</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {project ? formatDate(project.due_date) : "N/A"}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Customer</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {project ? project.customername : "N/A"}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Nation</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {project ? project.nation : "N/A"}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Cost</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {project ? project.cost : "N/A"}
            </dd>
          </div>
          
          {/* <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Employees</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {employees.length > 0 ? (
                <ul>
                  {employees.map((emp) => (
                    <li key={emp.employee_id}>
                      {emp.firstname} {emp.lastname} - {emp.role_name}
                    </li>
                  ))}
                </ul>
              ) : (
                "No employees assigned"
              )}
            </dd>
          </div> */}
        </dl>
      </div>
    </div>
  );
};

export default ProjectInformation;
