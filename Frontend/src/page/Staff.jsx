import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { CirclePlus } from "lucide-react";
import { Employee } from '../context/ContextProvider';

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Staff = () => {
  const navigate = useNavigate();
  const { currentEmployeeId, setCurrentEmployeeId } = useContext(Employee);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    fetchEmployees();
    initFilters();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${backendUrl}/getEmployee2`); // Fetching employees from backend
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstname: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      lastname: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      email: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      isadmin: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      role_name: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
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

  const deleteEmployee = async (employee_id) => {
    try {
      const response = await fetch(`${backendUrl}/deleteEmployee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id }),
      });
      if (response.ok) {
        setEmployees(employees.filter(emp => emp.employee_id !== employee_id));
      } else {
        console.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const actionButtonTemplate = (rowData) => (
    <div className="flex gap-2">
      <button
        onClick={() => {
          setCurrentEmployeeId(rowData.employee_id);
          console.log("Employee ID: " + currentEmployeeId);
          navigate("/view-account-for-staff");
        }}
        className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
      >
        Edit
      </button>
      <button
        onClick={() => deleteEmployee(rowData.employee_id)}
        className="cursor-pointer rounded-md bg-red-700 px-4 py-2 text-xs font-medium text-white hover:bg-red-500"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-gray-900">Staff Dashboard</h1>
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
            onClick={() => navigate("/create-employee")}
          >
            <CirclePlus className="w-5 h-5" /> Add Staff
          </button>
        </div>
      </div>

      <DataTable
        value={employees}
        paginator
        rows={5}
        loading={loading}
        dataKey="employee_id"
        emptyMessage="No employees found."
        showGridlines
        className="rounded-lg shadow-md border border-gray-300 mt-4 z-10"
        filters={filters}
        globalFilterFields={['firstname', 'lastname', 'email', 'isadmin', 'role_name']}
        filterDisplay="menu"
      >
        {/* <Column field="employee_id" header="ID" style={{ minWidth: '5rem' }} /> */}
        <Column field="firstname" header="First Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
        <Column field="lastname" header="Last Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
        <Column field="email" header="Email" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '16rem' }} />
        <Column field="role_name" header="Role" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
        <Column
          field="isadmin"
          header="Admin"
          body={(rowData) => (rowData.isadmin ? "Yes" : "No")}
          filter
          filterMenuStyle={{ width: '10rem' }}
          style={{ minWidth: '8rem' }}
        />
        <Column header="Action" body={actionButtonTemplate} style={{ minWidth: "12rem" }} />
      </DataTable>
    </div>
  );
};

export default Staff;
