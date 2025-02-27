import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Info, ClipboardList, Users, CirclePlus } from "lucide-react"; // Importing icons

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ProjectInformation = () => {
  const navigate = useNavigate();

  // Sample Data
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects([
        {
          project_id: 1,
          project_name: "Project Alpha",
          start_date: "2024-01-10",
          due_date: "2024-06-15",
          project_status: "Active",
          nation: "USA",
        },
        {
          project_id: 2,
          project_name: "Project Beta",
          start_date: "2024-02-05",
          due_date: "2024-07-20",
          project_status: "Pending",
          nation: "Germany",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // View Button Column
  const viewButtonTemplate = (rowData) => {
    return (
      <button
        onClick={() => navigate(`/project-detail/${rowData.project_id}`)}
        className="inline-block rounded-md bg-green-700 px-4 py-2 text-xs font-medium text-white hover:bg-green-500"
      >
        View
      </button>
    );
  };

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
            <dt className="font-medium text-gray-900">Title</dt>
            <dd className="text-gray-700 sm:col-span-2">Mr</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Name</dt>
            <dd className="text-gray-700 sm:col-span-2">John Frusciante</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Occupation</dt>
            <dd className="text-gray-700 sm:col-span-2">Guitarist</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Salary</dt>
            <dd className="text-gray-700 sm:col-span-2">$1,000,000+</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Bio</dt>
            <dd className="text-gray-700 sm:col-span-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et
              facilis debitis explicabo doloremque impedit nesciunt dolorem
              facere, dolor quasi veritatis quia fugit aperiam aspernatur neque
              molestiae labore aliquam soluta architecto?
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProjectInformation;
