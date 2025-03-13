import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { CirclePlus } from "lucide-react";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Employee, ProjectContext } from '../context/ContextProvider';

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Project = () => {

  const { employeeId } = useContext(Employee);
  const { setProjectId } = useContext(ProjectContext);

  const fectchproject = async () => {
    try {
      const response = await fetch(`${backendUrl}/projects/get-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id: employeeId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was a problem fetching the mock data:", error);
    }
  };

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    async function init(params) {
      console.log("Employee ID: " + employeeId)
      const data = await fectchproject();
      setProjects(data.projects)
      setLoading(false)
      initFilters
    }
    init();
  }, []);


  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      project_name: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      project_status: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      nation: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    });
  };

  const clearFilter = () => {
    initFilters();
    setGlobalFilterValue('');
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      global: { value, matchMode: FilterMatchMode.CONTAINS }
    }));
    setGlobalFilterValue(value);
  };


  const viewproject = async (rowData) => {
    setProjectId(rowData.project_id);
    navigate(`/project-information`);
  }

  const viewButtonTemplate = (rowData) => {
    return (
      <button
        onClick={() => viewproject(rowData)}
        className="cursor-pointer inline-block rounded-md bg-green-700 px-4 py-2 text-xs font-medium text-white hover:bg-green-500"
      >
        View
      </button>
    );
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

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-gray-900">Project Dashboard</h1>
      </div>

      <div className="flex justify-between mb-4">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
        <div className="flex items-center gap-4 ml-auto">
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="pl-10 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
            onClick={() => navigate("/create-project2")}
          >
            <CirclePlus className="w-5 h-5" /> Create new project
          </button>

        </div>
      </div>

      <DataTable
        value={projects}
        paginator
        rows={5}
        loading={loading}
        dataKey="project_id"
        emptyMessage="No projects found."
        showGridlines
        className="rounded-lg shadow-md border border-gray-300 mt-4 z-10"
        filters={filters}
        globalFilterFields={['project_name', 'project_status', 'nation']}
        filterDisplay="menu"
        rowClassName={(rowData) => rowData.ismanager ? 'font-bold' : ''}
      >
        {/* <Column field="project_id" header="ID" style={{ minWidth: '5rem' }} /> */}
        <Column
          field="project_name"
          header="Project Name"
          filter
          filterMenuStyle={{ width: '14rem' }}
          style={{ minWidth: '12rem' }}
        />
        <Column field="start_date" header="Start Date" body={(rowData) => formatDate(rowData.start_date)} style={{ minWidth: '10rem' }} />
        <Column field="due_date" header="Due Date" body={(rowData) => formatDate(rowData.due_date)} style={{ minWidth: '10rem' }} />
        <Column
          field="project_status"
          header="Status"
          filter
          filterMenuStyle={{ width: '14rem' }}
          style={{ minWidth: '10rem' }}
        />
        <Column
          field="nation"
          header="Nation"
          filter
          filterMenuStyle={{ width: '14rem' }}
          style={{ minWidth: '10rem' }}
        />
        <Column header="Action" body={viewButtonTemplate} style={{ minWidth: "8rem" }} />
      </DataTable>
    </div>
  );
};

export default Project;






























































































































// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from "react-router-dom";
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { FilterMatchMode } from 'primereact/api';
// import { CirclePlus } from "lucide-react";

// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";

// import { Employee } from '../context/ContextProvider';


// const Project = () => {

//   const { employeeId } = useContext(Employee);

//   const fectchproject = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/projects/get-project", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ employee_id: employeeId }),
//       });
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("There was a problem fetching the mock data:", error);
//     }
//   };

//   const navigate = useNavigate();

//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState(null);
//   const [globalFilterValue, setGlobalFilterValue] = useState('');

//   useEffect(() => {
//     async function init(params) {
//       console.log(employeeId)
//       const data = await fectchproject();
//       setProjects(data.projects)
//       setLoading(false)
//       initFilters
//     }
//     init();
//   }, []);


//   const initFilters = () => {
//     setFilters({
//       global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       project_name: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
//       project_status: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//       nation: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
//     });
//   };

//   const clearFilter = () => {
//     initFilters();
//     setGlobalFilterValue('');
//   };

//   const onGlobalFilterChange = (e) => {
//     const value = e.target.value;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       global: { value, matchMode: FilterMatchMode.CONTAINS }
//     }));
//     setGlobalFilterValue(value);
//   };

//   const viewButtonTemplate = (rowData) => {
//     return (
//       <button
//         onClick={() => navigate(`/project-information/${rowData.project_id}`)}
//         className="inline-block rounded-md bg-green-700 px-4 py-2 text-xs font-medium text-white hover:bg-green-500"
//       >
//         View
//       </button>
//     );
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return ''; // Handle cases where the date might be null/undefined

//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }).format(date); // Format as DD/MM/YYYY
//   };

//   return (
//     <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-4xl font-bold text-gray-900">Project Dashboard</h1>
//         {/* <button
//           className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
//           onClick={() => navigate("/create-project")}
//         >
//           <CirclePlus className="w-5 h-5" /> Create new project
//         </button> */}
//       </div>

//       <div className="flex justify-between mb-4">
//         <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
//         <div className="flex items-center gap-4 ml-auto">
//           <InputText
//             value={globalFilterValue}
//             onChange={onGlobalFilterChange}
//             placeholder="Keyword Search"
//             className="pl-10 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
//           />
//           <button
//             className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
//             onClick={() => navigate("/create-project2")}
//           >
//             <CirclePlus className="w-5 h-5" /> Create new project
//           </button>

//         </div>
//       </div>

//       <DataTable
//         value={projects}
//         paginator
//         rows={5}
//         loading={loading}
//         dataKey="project_id"
//         emptyMessage="No projects found."
//         showGridlines
//         className="rounded-lg shadow-md border border-gray-300 mt-4 z-10"
//         filters={filters}
//         globalFilterFields={['project_name', 'project_status', 'nation']}
//         filterDisplay="menu"
//       >
//         <Column field="project_id" header="ID" style={{ minWidth: '5rem' }} />
//         <Column
//           field="project_name"
//           header="Project Name"
//           filter
//           filterMenuStyle={{ width: '14rem' }}
//           style={{ minWidth: '12rem' }}
//         />
//         <Column field="start_date" header="Start Date" body={(rowData) => formatDate(rowData.start_date)} style={{ minWidth: '10rem' }} />
//         <Column field="due_date" header="Due Date" body={(rowData) => formatDate(rowData.due_date)} style={{ minWidth: '10rem' }} />
//         <Column
//           field="project_status"
//           header="Status"
//           filter
//           filterMenuStyle={{ width: '14rem' }}
//           style={{ minWidth: '10rem' }}
//         />
//         <Column
//           field="nation"
//           header="Nation"
//           filter
//           filterMenuStyle={{ width: '14rem' }}
//           style={{ minWidth: '10rem' }}
//         />
//         <Column header="Action" body={viewButtonTemplate} style={{ minWidth: "8rem" }} />
//       </DataTable>
//     </div>
//   );
// };

// export default Project;