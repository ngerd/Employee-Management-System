import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CirclePlus } from "lucide-react";
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
                { project_id: 1, project_name: "Project Alpha", start_date: "2024-01-10", due_date: "2024-06-15", project_status: "Active", nation: "USA" },
                { project_id: 2, project_name: "Project Beta", start_date: "2024-02-05", due_date: "2024-07-20", project_status: "Pending", nation: "Germany" },
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
                <button
                    className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
                    onClick={() => navigate("/create-project")}
                >
                    <CirclePlus className="w-5 h-5" /> Create new project
                </button>
            </div>

            <div className='mt-4'>
                <div className="sm:hidden">
                    <label htmlFor="Tab" className="sr-only">Tab</label>

                    <select id="Tab" className="w-full rounded-md border-gray-200">
                        <option>Settings</option>
                        <option>Messages</option>
                        <option>Archive</option>
                        <option select>Notifications</option>
                    </select>
                </div>

                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex gap-6">
                            <a
                                href="#"
                                className="shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Settings
                            </a>

                            <a
                                href="#"
                                className="shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Messages
                            </a>

                            <a
                                href="#"
                                className="shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Archive
                            </a>

                            <a
                                href="#"
                                className="shrink-0 rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600"
                            >
                                Notifications
                            </a>
                        </nav>
                    </div>
                </div>
            </div>

            {/* DataTable */}
            <DataTable
                value={projects}
                paginator
                rows={10}
                loading={loading}
                dataKey="project_id"
                emptyMessage="No projects found."
                showGridlines
                className="rounded-lg shadow-md border border-gray-300"
            >
                <Column field="project_id" header="ID" style={{ minWidth: '5rem' }} />
                <Column field="project_name" header="Project Name" style={{ minWidth: '12rem' }} />
                <Column field="start_date" header="Start Date" style={{ minWidth: '10rem' }} />
                <Column field="due_date" header="Due Date" style={{ minWidth: '10rem' }} />
                <Column field="project_status" header="Status" style={{ minWidth: '10rem' }} />
                <Column field="nation" header="Nation" style={{ minWidth: '10rem' }} />
                <Column header="Action" body={viewButtonTemplate} style={{ minWidth: '8rem' }} />
            </DataTable>
        </div>
    );
};

export default ProjectInformation;
