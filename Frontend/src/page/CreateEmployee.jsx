import React, { useState } from "react";

const CreateEmployee = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Choose Role");
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    isadmin: false,
    role_id: "",
  });

  const roles = [
    { id: 1, name: "Junior Consultant" },
    { id: 2, name: "Consultant" },
    { id: 3, name: "Sr Consultant Functional" },
    { id: 4, name: "Sr Consultant Technical" },
    { id: 5, name: "Lead Expert" },
    { id: 6, name: "Manager" },
  ];

  const handleSelect = (role) => {
    setSelectedRole(role.name);
    setFormValues({ ...formValues, role_id: role.id });
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({ ...formValues, [name]: type === 'checkbox' ? checked : value });
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
      console.log(data);
    } catch (error) {
      console.error("There was a problem creating the employee:", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 lg:px-10">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Create Employee</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                id="firstname"
                name="firstname"
                value={formValues.firstname}
                onChange={handleChange}
                className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                placeholder="First Name"
              />
            </div>
            <div className="flex-1">
              <input
                id="lastname"
                name="lastname"
                value={formValues.lastname}
                onChange={handleChange}
                className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                placeholder="Last Name"
              />
            </div>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            placeholder="Email"
          />
          <input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            placeholder="Password"
          />

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formValues.confirmPassword}
            onChange={handleChange}
            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            placeholder="Password Confirmation"
          />

          <div className="relative mt-7">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md shadow-sm hover:bg-gray-50"
            >
              {selectedRole}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <ul className="py-1">
                  {roles.map((role) => (
                    <li key={role.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(role)}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {role.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="col-span-6">
            <label htmlFor="isadmin" className="flex gap-4">
              <input
                type="checkbox"
                id="isadmin"
                name="isadmin"
                checked={formValues.isadmin}
                onChange={handleChange}
                className="size-6 rounded-md border-gray-300 bg-white shadow-sm"
              />

              <span className="block text-sm font-medium text-gray-700">
                Manager Role
              </span>
            </label>
          </div>
          <div className="mt-4 text-right">
            <button
              type="submit"
              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-200 hover:text-blue-800 focus:ring-3 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
