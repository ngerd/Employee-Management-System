import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [employeeId, setEmployeeId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/projects/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      setProjectId(data.project.project_id);
      setIsEditing(true);
    } catch (error) {
      console.error("There was a problem creating the project:", error);
    }
  };

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
    } catch (error) {
      console.error("There was a problem updating the project:", error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      const response = await fetch("http://localhost:3000/projects/add-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id: employeeId, project_id: projectId }),
      });
      const data = await response.json();
      setEmployees([...employees, data.data]);
      setEmployeeId("");
    } catch (error) {
      console.error("There was a problem adding the employee:", error);
    }
  };

  const handleFinish = () => {
    navigate("/project");
  };

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      <div className="mt-4 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
        {/* Create/Edit project */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl pb-10 font-extrabold text-gray-900">
            {isEditing ? "Edit Project" : "Create Project"}
          </h2>
          <form className="space-y-4" onSubmit={isEditing ? handleSave : handleSubmit}>
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
              <option value="" disabled>Select a nation</option>
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
              <button type="submit" className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto">
                {isEditing ? "Save" : "Create Project"}
              </button>
            </div>
          </form>
        </div>

        {/* Add employee */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Add Employee</h2>
          <div className="space-y-4">
            <input
              id="employee_id"
              name="employee_id"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Employee ID"
            />
            <button
              type="button"
              onClick={handleAddEmployee}
              disabled={!projectId} // Disable button if projectId is null
              className={`inline-block w-full rounded-lg px-5 py-3 font-medium text-white sm:w-auto ${!projectId ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`}
            >
              Add Employee
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-900">Employees</h3>
            <ul className="mt-2 space-y-2">
              {employees.map((employee) => (
                <li key={employee.employee_id} className="flex justify-between items-center">
                  <span>{employee.employee_id}</span>
                  <span>{employee.ismanager ? "Manager" : "Member"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 text-right">
        <button
          type="button"
          onClick={handleFinish}
          className="inline-block w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white sm:w-auto"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default CreateProject2;
