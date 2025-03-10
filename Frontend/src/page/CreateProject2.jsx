import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../context/ContextProvider";
import Alert from "../component/Alert";

const CreateProject2 = () => {
  const [formValues, setFormValues] = useState({
    project_name: "",
    project_description: "",
    start_date: "",
    due_date: "",
    customername: "",
    nation: "",
    cost: "",
  });
  const [projectId, setProjectId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { employeeId } = useContext(Employee);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Create project and assign the creator as the manager
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create the project
      const response = await fetch("http://localhost:3000/projects/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      if (data.project && data.project.project_id) {
        const newProjectId = data.project.project_id;
        setProjectId(newProjectId);
        setIsEditing(true);

        // Step 2: Assign the creator as a manager
        const addEmployeeResponse = await fetch("http://localhost:3000/projects/add-employee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_ids: [employeeId], // Only the creator
            project_id: newProjectId,
            ismanager: [employeeId], // The creator is a manager
          }),
        });
        const addEmployeeData = await addEmployeeResponse.json();
        if (addEmployeeResponse.ok) {
          setAlert({
            show: true,
            message: "Project created successfully!",
            type: "success",
          });
        } else {
          throw new Error(addEmployeeData.error || "Failed to assign manager.");
        }
      } else {
        throw new Error("Failed to create project.");
      }
    } catch (error) {
      setAlert({
        show: true,
        message: "There was a problem creating the project.",
        type: "error",
      });
      console.error("There was a problem creating the project:", error);
    }
  };

  // Update project if editing
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/projects/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formValues, project_id: projectId }),
      });
      const data = await response.json();
      console.log(data);
      setAlert({
        show: true,
        message: "Update project successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("There was a problem updating the project:", error);
      setAlert({
        show: true,
        message: "There was a problem updating the project.",
        type: "error",
      });
    }
  };

  // Add additional employees (all added later are non-managers)
  const handleAddEmployee = async () => {
    if (!projectId || selectedEmployees.length === 0) {
      setAlert({
        show: true,
        message: "Please select at least one employee.",
        type: "error",
      });
      return;
    }
    try {
      const employee_ids = selectedEmployees.map((emp) => emp.employee_id);
      // Since new employees added later are not managers, ismanager is always an empty array.
      const response = await fetch("http://localhost:3000/projects/add-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_ids, // Array of employee IDs
          project_id: projectId,
          ismanager: [] // No additional managers
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setEmployees([...employees, ...selectedEmployees]);
        setSelectedEmployees([]);
        setSearchTerm("");
        setAlert({
          show: true,
          message: "Employees added successfully!",
          type: "success",
        });
        setTimeout(() => {
          navigate("/project");
        }, 3000);
      } else {
        throw new Error(data.error || "Failed to add employees.");
      }
    } catch (error) {
      console.error("There was a problem adding the employees:", error);
      setAlert({
        show: true,
        message: "There was a problem adding the employees.",
        type: "error",
      });
    }
  };

  const handleFinish = () => {
    navigate("/project");
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-employees");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEmployees(data.employees);
      } catch (error) {
        console.error("There was a problem fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const availableEmployees = employees.filter(
    (emp) =>
      !selectedEmployees.some(
        (selected) => selected.employee_id === emp.employee_id
      ) &&
      `${emp.firstname} ${emp.lastname} - ${emp.role_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

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
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
      )}
      <div className="mt-4 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
        {/* Create/Edit project */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl pb-10 font-extrabold text-gray-900">
            {isEditing ? "Edit Project" : "Create Project"}
          </h2>
          <form
            className="space-y-4"
            onSubmit={isEditing ? handleSave : handleSubmit}
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
            <input
              id="customername"
              name="customername"
              value={formValues.customername}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Customer Name"
            />
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
            <div className="mt-6 text-right">
              <button
                type="submit"
                className="cursor-pointer inline-block w-full rounded-lg bg-black hover:bg-gray-700 px-5 py-3 font-medium text-white sm:w-auto"
              >
                {isEditing ? "Save" : "Create Project"}
              </button>
            </div>
          </form>
        </div>

        {/* Add employee */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl pb-10 font-extrabold text-gray-900">
            Add Employee
          </h2>
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
                      if (
                        !selectedEmployees.some(
                          (selected) => selected.employee_id === emp.employee_id
                        )
                      ) {
                        setSelectedEmployees([...selectedEmployees, emp]);
                      }
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
                          className="cursor-pointer text-red-500 hover:text-red-700"
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
          <div className="mt-6 text-right">
            <button
              type="button"
              onClick={handleAddEmployee}
              disabled={!projectId}
              className={`inline-block w-full rounded-lg px-5 py-3 font-medium text-white sm:w-auto ${
                !projectId
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-700 cursor-pointer"
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

export default CreateProject2;
