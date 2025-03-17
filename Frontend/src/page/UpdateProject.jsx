import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Employee, ProjectContext } from "../context/ContextProvider";
import Alert from "../component/Alert";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const UpdateProject = () => {
    const { projectId } = useContext(ProjectContext);
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        project_name: "",
        project_description: "",
        start_date: "",
        due_date: "",
        customer_id: "",
        nation: "",
        cost: "",
        billable: false,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCustomerName, setSelectedCustomerName] = useState("Choose Customer");
    const [customerName, setCustomerName] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });
    const dropdownRef = useRef(null);


    useEffect(() => {
        const fetchProjectInfo = async () => {
            try {
                const response = await fetch(`${backendUrl}/projects/info`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ projectId }),
                });
                console.log("Project ID: " + projectId);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error response text:", errorText);
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log("Fetched project data:", data);
                setFormValues({
                    project_name: data.project.project_name,
                    project_description: data.project.project_description,
                    start_date: data.project.start_date.split("T")[0],
                    due_date: data.project.due_date.split("T")[0],
                    customer_id: data.project.customer_id,
                    nation: data.project.nation,
                    cost: data.project.cost,
                    billable: data.project.billable,
                });
                console.log("API Response:", data);
                console.log("Customer ID from API:", data.project.customer_id);

                setSelectedCustomerName(`${data.project.customer_name}`);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (projectId) {
            fetchProjectInfo();
            setIsEditing(true);
        }
    }, [projectId]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const validateForm = () => {
        const requiredFields = [
            "project_name",
            "project_description",
            "start_date",
            "due_date",
            "customer_id",
            "nation",
            "cost",
        ];
        for (let field of requiredFields) {
            if (!formValues[field]) {
                setAlert({
                    show: true,
                    message: `Please fill in the ${field.replace("_", " ")} field.`,
                    type: "error",
                });
                return false;
            }
        }
        return true;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const response = await fetch(`${backendUrl}/projects/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formValues, project_id: projectId }),
            });
            const data = await response.json();
            if (response.ok) {
                setAlert({
                    show: true,
                    message: "Project updated successfully!",
                    type: "success",
                });
                setTimeout(() => navigate("/project"), 1500);
            } else {
                setAlert({
                    show: true,
                    message: data.error || "Failed to update project.",
                    type: "error",
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                message: "There was a problem updating the project.",
                type: "error",
            });
            console.error("Update error:", error);
        }
    };


    const handleFinish = () => {
        navigate("/project");
    };



    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="mx-auto max-w-xl py-10 sm:px-6 lg:px-8">
            {alert.show && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false, message: "", type: "" })}
                />
            )}
            <div className="mt-4 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-">
                <div className="rounded-lg bg-white p-8 shadow-lg">
                    <h2 className="text-2xl pb-10 font-extrabold text-gray-900">
                        {isEditing ? "Edit Project" : "Create Project"}
                    </h2>
                    <form
                        className="space-y-4"
                        onSubmit={handleSave}
                    >
                        <input
                            id="project_name"
                            name="project_name"
                            value={formValues.project_name}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            placeholder="Project Name"
                        />
                        <textarea
                            id="project_description"
                            name="project_description"
                            value={formValues.project_description}
                            onChange={handleChange}
                            className="mt-1 p-2 h-20 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Project Description"
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={formValues.start_date}
                                onChange={handleChange}
                                className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Start Date"
                            />
                            <input
                                type="date"
                                id="due_date"
                                name="due_date"
                                value={formValues.due_date}
                                onChange={handleChange}
                                className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Due Date"
                            />
                        </div>

                        <div className="relative mt-1">
                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md shadow-sm hover:bg-gray-50"
                                disabled={isEditing}
                            >
                                {selectedCustomerName}
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* {isOpen && (
                                <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                    <ul className="py-1">
                                        {customerName.map((customer) => (
                                            <li key={customer.company_code}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelect(customer)}
                                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                                    disabled={isEditing}
                                                >
                                                    {`${customer.company_code} - ${customer.legal_name}`}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )} */}
                        </div>

                        <select
                            id="nation"
                            name="nation"
                            value={formValues.nation}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>
                                Select a nation
                            </option>
                            <option value="Singapore">Singapore</option>
                            <option value="Viet Nam">Viet Nam</option>
                        </select>
                        <input
                            type="number"
                            id="cost"
                            name="cost"
                            value={formValues.cost}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Cost"
                        />

                        <div className="col-span-6 mt-3">
                            <label htmlFor="isadmin" className="flex gap-4">
                                <input
                                    type="checkbox"
                                    id="isadmin"
                                    name="isadmin"
                                    checked={formValues.billable}
                                    onChange={(e) =>
                                        setFormValues({ ...formValues, billable: e.target.checked })
                                    }
                                    className="size-6 rounded-md border-gray-300 bg-white shadow-sm"
                                />
                                <span className="block text-sm font-medium text-gray-700">Billable</span>
                            </label>
                        </div>

                        <div className="mt-6 text-right">
                            <button
                                type="submit"
                                className="cursor-pointer inline-block w-full rounded-lg bg-black hover:bg-gray-700 px-5 py-3 font-medium text-white sm:w-auto"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default UpdateProject;