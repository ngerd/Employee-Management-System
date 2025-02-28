import React, { useState, useRef } from "react";
import TextInput from "../component/TextInput";
import TextAreaInput from "../component/TextAreaInput";
import { Pencil } from "lucide-react";

const employees = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Brown" },
    { id: 4, name: "Diana Prince" },
    { id: 5, name: "Ethan Hunt" },
];

const CreateProject = () => {
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const availableEmployees = employees.filter(
        (emp) => !selectedEmployees.some((selected) => selected.id === emp.id) &&
            emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddEmployee = (employee) => {
        setSelectedEmployees([...selectedEmployees, employee]);
        setSearchTerm("");
    };

    const handleRemoveEmployee = (id) => {
        setSelectedEmployees(selectedEmployees.filter((e) => e.id !== id));
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
                Create Project
                <Pencil className="w-8 h-11 text-red-800 transform" />
            </h1>
            <div className="mt-4 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-1 lg:p-12">
                    <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Create Project</h2>
                    <form action="#" className="space-y-4">
                        <TextInput label="Project Name" id="ProjectName" name="project_name" />
                        <TextAreaInput label="Project Description" id="projectDescription" name="project_description" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <TextInput label="Customer Name" id="CustomerName" name="customer_name" />
                        <select id="Nation" name="nation" classname="relative">
                            <option value="Vietnam">Vietnam</option>
                            <option value="Singapore">Singapore</option>
                        </select>
                    </form>
                </div>

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
                        {isDropdownOpen && (
                            <ul className="absolute w-full mt-2 max-h-40 overflow-auto border rounded-md bg-white shadow-lg">
                                {availableEmployees.map((emp) => (
                                    <li key={emp.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAddEmployee(emp)}>
                                        {emp.name}
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
                                        <th className="border p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEmployees.map((emp) => (
                                        <tr key={emp.id}>
                                            <td className="border p-2">{emp.name}</td>
                                            <td className="border p-2 text-center">
                                                <button className="text-red-500" onClick={() => handleRemoveEmployee(emp.id)} type="button">
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
