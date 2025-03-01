import React, { useState, useEffect, useRef } from "react";

const CreateProject = () => {
    const [employees, setEmployees] = useState([]); // Store fetched employees
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://localhost:3000/get-employees");
                if (!response.ok) {
                    throw new Error("Failed to fetch employees");
                }
                const data = await response.json();
                console.log(data);
                setEmployees(data.employees);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    const availableEmployees = employees.filter(
        (emp) =>
            !selectedEmployees.some((selected) => selected.employee_id === emp.employee_id) &&
            `${emp.firstname} ${emp.lastname} - ${emp.role_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddEmployee = (employee) => {
        setSelectedEmployees([...selectedEmployees, employee]);
        setSearchTerm("");
    };

    const handleRemoveEmployee = (employee_id) => {
        setSelectedEmployees(selectedEmployees.filter((e) => e.employee_id !== employee_id));
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
        <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
            <div className="mt-4 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-1 lg:p-12">
                    <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Create Team</h2>
                    <div className="mt-4 relative" ref={dropdownRef}>
                        <input
                            type="text"
                            placeholder="Search Members..."
                            className="w-full p-2 border rounded-md cursor-pointer"
                            value={searchTerm}
                            onFocus={() => setIsDropdownOpen(true)}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {isDropdownOpen && availableEmployees.length > 0 && (
                            <ul className="absolute w-full mt-2 max-h-40 overflow-auto border rounded-md bg-white shadow-lg">
                                {availableEmployees.map((emp) => (
                                    <li
                                        key={emp.employee_id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleAddEmployee(emp)}
                                    >
                                        {`${emp.firstname} ${emp.lastname} - ${emp.role_name}`}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {selectedEmployees.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Selected Members</h3>
                            <table className="w-full mt-2 border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Name</th>
                                        <th className="border p-2">Role</th>
                                        <th className="border p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEmployees.map((emp) => (
                                        <tr key={emp.employee_id}>
                                            <td className="border p-2">{emp.firstname} {emp.lastname}</td>
                                            <td className="border p-2">{emp.role_name}</td>
                                            <td className="border p-2 text-center">
                                                <button className="text-red-500" onClick={() => handleRemoveEmployee(emp.employee_id)} type="button">
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 text-right">
                <button type="submit" className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto">
                    Create Project
                </button>
            </div>
        </div>
    );
};

export default CreateProject;
