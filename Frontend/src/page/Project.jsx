import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { CirclePlus } from "lucide-react";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Project = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setProjects([
        { project_id: 1, project_name: "Apollo Program", start_date: "2024-01-10", due_date: "2024-06-15", project_status: "Active", nation: "USA" },
        { project_id: 2, project_name: "Eurofighter Typhoon", start_date: "2024-02-05", due_date: "2024-07-20", project_status: "Pending", nation: "Germany" },
        { project_id: 3, project_name: "Hadron Collider", start_date: "2024-03-12", due_date: "2024-09-30", project_status: "Completed", nation: "Switzerland" },
        { project_id: 4, project_name: "Mars Rover Perseverance", start_date: "2024-04-01", due_date: "2024-12-10", project_status: "Active", nation: "USA" },
        { project_id: 5, project_name: "ITER Fusion Reactor", start_date: "2024-05-20", due_date: "2025-06-25", project_status: "Delayed", nation: "France" },
        { project_id: 6, project_name: "Shinkansen High-Speed Rail", start_date: "2024-06-15", due_date: "2024-11-30", project_status: "Active", nation: "Japan" },
        { project_id: 7, project_name: "James Webb Space Telescope", start_date: "2024-07-10", due_date: "2025-01-20", project_status: "Pending", nation: "USA" },
        { project_id: 8, project_name: "London Crossrail", start_date: "2024-08-05", due_date: "2025-05-15", project_status: "Ongoing", nation: "UK" },
        { project_id: 9, project_name: "Burj Khalifa Construction", start_date: "2024-09-22", due_date: "2025-10-10", project_status: "Planned", nation: "UAE" },
        { project_id: 10, project_name: "Three Gorges Dam", start_date: "2024-10-18", due_date: "2025-08-30", project_status: "Active", nation: "China" }
      ]);
      setLoading(false);
      initFilters();
    }, 1000);
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

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-gray-900">Project Dashboard</h1>
        <button
          className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
          onClick={() => navigate("/create-project")}
        >
          <CirclePlus className="w-5 h-5" /> Create new project
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </IconField>
      </div>

      <DataTable
        value={projects}
        paginator
        rows={5}
        loading={loading}
        dataKey="project_id"
        emptyMessage="No projects found."
        showGridlines
        className="rounded-lg shadow-md border border-gray-300 mt-4"
        filters={filters}
        globalFilterFields={['project_name', 'project_status', 'nation']}
        filterDisplay="menu"
      >
        <Column field="project_id" header="ID" style={{ minWidth: '5rem' }} />
        <Column
          field="project_name"
          header="Project Name"
          filter
          filterMenuStyle={{ width: '14rem' }}
          style={{ minWidth: '12rem' }}
        />
        <Column field="start_date" header="Start Date" style={{ minWidth: '10rem' }} />
        <Column field="due_date" header="Due Date" style={{ minWidth: '10rem' }} />
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
      </DataTable>
    </div>
  );
};

export default Project;
