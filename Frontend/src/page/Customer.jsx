import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { CirclePlus } from "lucide-react";
import { CustomerContext } from '../context/ContextProvider';


import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Customer = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const { setcompany_code } = useContext(CustomerContext);

    useEffect(() => {
        fetchCustomers();
        initFilters();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${backendUrl}/customer/allcustomer`);
            const data = await response.json();
            if (data.customers) {
                setCustomers(data.customers);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            legal_name: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            company_code: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            country: { operator: 'or', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
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

    const deleteCustomer = async (company_code) => {
        try {
            const response = await fetch(`${backendUrl}/customer/delete-customer`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ company_code }),
            });
            if (response.ok) {
                setCustomers(customers.filter(cust => cust.company_code !== company_code));
            } else {
                console.error("Failed to delete customer");
            }
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    const viewCustomer = (rowData) => {
        setcompany_code(rowData.company_code);
        navigate(`/customer-information`);
    };

    const actionButtonTemplate = (rowData) => (
        <div className="flex gap-2">
            <button
                onClick={() => viewCustomer(rowData)}
                className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
            >
                View
            </button>
            <button
                onClick={() => deleteCustomer(rowData.company_code)}
                className="cursor-pointer rounded-md bg-red-700 px-4 py-2 text-xs font-medium text-white hover:bg-red-500"
            >
                Delete
            </button>
        </div>
    );


    // const actionButtonTemplate = (rowData) => (
    //     <div className="flex gap-2">
    //         <button
    //             onClick={() => {
    //                 setcompany_code(rowData.company_code);
    //                 navigate("/customer-information");
    //             }}
    //             className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-500"
    //         >
    //             View
    //         </button>
    //         <button
    //             onClick={() => deleteCustomer(rowData.company_code)}
    //             className="cursor-pointer rounded-md bg-red-700 px-4 py-2 text-xs font-medium text-white hover:bg-red-500"
    //         >
    //             Delete
    //         </button>
    //     </div>
    // );

    return (
        <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-gray-900">Customer Dashboard</h1>
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
                        onClick={() => navigate("/create-customer")}
                    >
                        <CirclePlus className="w-5 h-5" /> Add Customer
                    </button>

                </div>
            </div>

            <DataTable
                value={customers}
                paginator
                rows={5}
                loading={loading}
                dataKey="company_code"
                emptyMessage="No customers found."
                showGridlines
                className="rounded-lg shadow-md border border-gray-300 mt-4 z-10"
                filters={filters}
                globalFilterFields={['legal_name', 'company_code', 'country']}
                filterDisplay="menu"
            >
                <Column field="legal_name" header="Legal Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="company_code" header="Company Code" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="country" header="Country" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header="Action" body={actionButtonTemplate} style={{ minWidth: "12rem" }} />
            </DataTable>
        </div>
    );
};

export default Customer;
