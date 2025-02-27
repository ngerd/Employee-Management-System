import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pin, Filter } from "lucide-react";

const Project = () => {
  const navigate = useNavigate();
  const dropdownRefs = {
    name: useRef(null),
    duration: useRef(null),
    manager: useRef(null),
    code: useRef(null),
  };

  const projects = [
    {
      name: "Web development",
      duration: "55/01/2025-03/03/2025",
      manager: "John",
      code: "1234",
    },
    {
      name: "Capstone",
      duration: "1/01/2025-03/03/2025",
      manager: "YN",
      code: "1573",
    },
    {
      name: "Game development",
      duration: "21/01/2025-03/04/2025",
      manager: "Jun",
      code: "G456",
    },
  ];

  const [filters, setFilters] = useState({
    name: [],
    duration: [],
    manager: [],
    code: [],
  });
  const [showDropdown, setShowDropdown] = useState({
    name: false,
    duration: false,
    manager: false,
    code: false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      let isClickInside = false;
      Object.keys(dropdownRefs).forEach((column) => {
        if (
          dropdownRefs[column].current &&
          dropdownRefs[column].current.contains(event.target)
        ) {
          isClickInside = true;
        }
      });
      if (!isClickInside) {
        setShowDropdown({
          name: false,
          duration: false,
          manager: false,
          code: false,
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (column) => {
    setShowDropdown((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => {
      const updated = prev[column].includes(value)
        ? prev[column].filter((item) => item !== value)
        : [...prev[column], value];
      return { ...prev, [column]: updated };
    });
  };

  let filteredProjects = projects;
  Object.keys(filters).forEach((column) => {
    if (filters[column].length) {
      filteredProjects = filteredProjects.filter((project) =>
        filters[column].includes(project[column])
      );
    }
  });

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between px-20 mt-10 mb-4">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Project Dashboard
          <Pin className="w-8 h-11 text-red-800 transform rotate-30" />
        </h1>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
          onClick={() => navigate("/create-project")}
        >
          Create new project
        </button>
      </div>

      <div className="ml-5 mr-5 mt-10 overflow-x-auto min-h-[300px]">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead>
            <tr>
              {["name", "duration", "manager", "code"].map((column) => (
                <th
                  key={column}
                  className="px-4 py-2 font-medium text-gray-900 relative"
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(column);
                    }}
                    className="ml-2"
                  >
                    <Filter className="w-4 h-4 inline-block" />
                  </button>
                  {showDropdown[column] && (
                    <div
                      ref={dropdownRefs[column]}
                      className="absolute bg-white border p-2 mt-1 shadow-md z-10 max-h-40 overflow-y-auto w-40"
                    >
                      {Array.from(new Set(projects.map((p) => p[column]))).map(
                        (value) => (
                          <label
                            key={value}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={filters[column].includes(value)}
                              onChange={() => handleFilterChange(column, value)}
                            />
                            <span>{value}</span>
                          </label>
                        )
                      )}
                    </div>
                  )}
                </th>
              ))}
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 min-h-[200px]">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr key={project.code}>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {project.duration}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{project.manager}</td>
                  <td className="px-4 py-2 text-gray-700">{project.code}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => navigate(`/view-project/${project.code}`)}
                      className="inline-block rounded-sm bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Project;
