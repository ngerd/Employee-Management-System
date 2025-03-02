import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Choose Role");
  const [roles, setRoles] = useState([]);
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    isadmin: false,
    role_id: "",
  });
  const [message, setMessage] = useState(""); // State for success/error messages

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-role"); // Adjust API URL
        const data = await response.json();
        setRoles(data.Role);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleSelect = (role) => {
    setSelectedRole(role.role_name);
    setFormValues({ ...formValues, role_id: role.role_id });
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({ ...formValues, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/createAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Employee added successfully!");
        setTimeout(() => {
          window.location.reload(); // Refresh the page after success
        }, 1500);
      } else {
        setMessage(data.message || "Failed to create employee.");
      }
    } catch (error) {
      setMessage("There was a problem creating the employee.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 lg:px-10">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Create Employee</h2>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-3 mb-4 rounded-md text-center ${message.includes("success") ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              id="firstname"
              name="firstname"
              value={formValues.firstname}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="First Name"
            />
            <input
              id="lastname"
              name="lastname"
              value={formValues.lastname}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Last Name"
            />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
          <input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
          />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formValues.confirmPassword}
            onChange={handleChange}
            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
          />

          {/* Role Dropdown */}
          <div className="relative mt-1">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md shadow-sm hover:bg-gray-50"
            >
              {selectedRole}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <ul className="py-1">
                  {roles.map((role) => (
                    <li key={role.role_id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(role)}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {role.role_name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Admin Checkbox */}
          <div className="col-span-6 mt-6">
            <label htmlFor="isadmin" className="flex gap-4">
              <input
                type="checkbox"
                id="isadmin"
                name="isadmin"
                checked={formValues.isadmin}
                onChange={handleChange}
                className="size-6 rounded-md border-gray-300 bg-white shadow-sm"
              />
              <span className="block text-sm font-medium text-gray-700">Admin Role</span>
            </label>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/staff")}
              className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
            >
              Back
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default CreateEmployee;
