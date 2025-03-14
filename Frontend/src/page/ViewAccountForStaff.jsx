import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../context/ContextProvider";
import Alert from "../component/Alert";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ViewAccountForStaff = () => {
  const navigate = useNavigate();
  const { currentEmployeeId } = useContext(Employee);
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role_id: "",
  });
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("Choose Role");
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" }); // State for alert

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      console.log("Meow " + currentEmployeeId);
      try {
        const response = await fetch(`${backendUrl}/getEmployeeById`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employee_id: currentEmployeeId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch employee info");
        }
        const data = await response.json();
        setFormValues({
          firstname: data.employee.firstname,
          lastname: data.employee.lastname,
          email: data.employee.email,
          role_id: data.employee.role_id,
        });
        setSelectedRole(data.employee.role_name);
      } catch (error) {
        console.error("There was a problem fetching the employee info:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await fetch(`${backendUrl}/get-role`);
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }
        const data = await response.json();
        setRoles(data.Role);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    if (currentEmployeeId) {
      fetchEmployeeInfo();
      fetchRoles();
    }
  }, [currentEmployeeId]);

  const handleSelect = (role) => {
    setSelectedRole(role.role_name);
    setFormValues({ ...formValues, role_id: role.role_id });
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/updateEmployee2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formValues, employee_id: currentEmployeeId }),
      });
      if (!response.ok) {
        throw new Error("Failed to update account");
      }
      setAlert({ message: "Account updated successfully!", type: "success" }); // Show success alert
      setTimeout(() => {
        navigate("/staff");
      }, 3000); // Delay the navigation by 3 seconds to show the alert
    } catch (error) {
      console.error("There was a problem updating the account:", error);
      setAlert({ message: "Failed to update account", type: "error" }); // Show error alert
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-12 sm:px-8 lg:px-10 grid grid-cols-1 gap-6">
      {alert.message && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "" })} />} {/* Render Alert */}
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-2xl pb-8 font-extrabold text-gray-900">View and Update Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              id="firstname"
              name="firstname"
              value={formValues.firstname}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              placeholder="First Name"
            />
            <input
              id="lastname"
              name="lastname"
              value={formValues.lastname}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              placeholder="Last Name"
            />
          </div>
          <input
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            placeholder="Email"
          />
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
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
              Update Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewAccountForStaff;
