import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Alert from "../component/Alert";
import { ProjectContext } from '../context/ContextProvider';

const AddMember = () => {
  const { projectId } = useContext(ProjectContext);
  const [formValues, setFormValues] = useState({ projectId });
  const [employees, setEmployees] = useState([]); // All employees
  const [projectMembers, setProjectMembers] = useState([]); // Employees already in project
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-employees");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployees(data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch employees already in the project
  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!projectId) return;
      try {
        const response = await fetch("http://localhost:3000/projects/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });
        if (!response.ok) throw new Error("Failed to fetch project members");
        const data = await response.json();
        setProjectMembers(data.employees || []);
      } catch (error) {
        console.error("Error fetching project members:", error);
      }
    };
    fetchProjectMembers();
  }, [projectId]);

  // Filter available employees (exclude those already in project or selected)
  const availableEmployees = employees.filter(
    (emp) =>
      !projectMembers.some((member) => member.employee_id === emp.employee_id) &&
      !selectedEmployees.some((selected) => selected.employee_id === emp.employee_id) &&
      `${emp.firstname} ${emp.lastname} - ${emp.role_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Add selected employees to the project using the new batch API
  const handleAddEmployee = async () => {
    if (!projectId) {
      setAlert({
        show: true,
        message: "Please select a project before adding employees.",
        type: "error",
      });
      return;
    }
    if (selectedEmployees.length === 0) {
      setAlert({
        show: true,
        message: "Please select at least one employee.",
        type: "error",
      });
      return;
    }
    try {
      // Create the payload for batch insertion
      const employee_ids = selectedEmployees.map((employee) => employee.employee_id);
      // New employees are added as non-managers
      const ismanager = [];

      const response = await fetch("http://localhost:3000/projects/add-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_ids, // Array of selected employee IDs
          project_id: projectId,
          ismanager, // Empty array means no additional managers
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Update local project members list
        setProjectMembers([...projectMembers, ...selectedEmployees]);
        setSelectedEmployees([]);
        setSearchTerm("");
        setAlert({ show: true, message: "Employees added successfully!", type: "success" });
        setTimeout(() => {
          navigate("/project-team");
        }, 3000);
      } else {
        throw new Error(data.error || "Failed to add employees.");
      }
    } catch (error) {
      console.error("Error adding employees:", error);
      setAlert({ show: true, message: "There was a problem adding the employees.", type: "error" });
    }
  };

  // Navigate to project team page
  const handleFinish = () => navigate("/project-team");

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      <div className="mt-4 grid grid-cols-1 gap-x-16 gap-y-8">
        {/* Add employee section */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Add Employee</h2>
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
                    onClick={() => {
                      setSelectedEmployees([...selectedEmployees, emp]);
                      setIsDropdownOpen(false);
                    }}
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
                      <td className="border p-2">
                        {emp.firstname} {emp.lastname}
                      </td>
                      <td className="border p-2">{emp.role_name}</td>
                      <td className="border p-2 text-center">
                        <button
                          className="text-red-500"
                          onClick={() =>
                            setSelectedEmployees(
                              selectedEmployees.filter(
                                (e) => e.employee_id !== emp.employee_id
                              )
                            )
                          }
                          type="button"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/project-team")}
              className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleAddEmployee}
              disabled={!projectId}
              className={`cursor-pointer rounded-lg px-5 py-3 font-medium text-white ${
                !projectId ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-700"
              }`}
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMember;