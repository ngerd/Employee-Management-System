import React, { useState } from "react";
import TextInput from "../component/TextInput";
import EmailInput from "../component/EmailInput";
import PasswordInput from "../component/PasswordInput";

const CreateEmployee = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Choose Role");

  const roles = [
    { id: 1, name: "Devloper" },
    { id: 2, name: "Designer" },
    { id: 3, name: "Project Manager" },
  ];

  const handleSelect = (role) => {
    setSelectedRole(role.name);
    setIsOpen(false);
    console.log("Selected Role:", role.name); // You can store this in a form state
  };

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Create Employee</h2>
          <form className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <TextInput label="First Name" id="FirstName" name="first_name" />
              </div>
              <div className="flex-1">
                <TextInput label="Last Name" id="LastName" name="last_name" />
              </div>
            </div>
            <TextInput label="Username" id="Username" name="username" />
            <EmailInput label="Email" id="Email" name="email" type="email" />
            <PasswordInput label="Password" id="Password" name="password" type="password" />

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
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
                <label htmlFor="MarketingAccept" className="flex gap-4">
                  <input
                    type="checkbox"
                    id="MarketingAccept"
                    name="marketing_accept"
                    className="size-6 rounded-md border-gray-300 bg-white shadow-sm"
                  />

                  <span className="block text-sm font-medium text-gray-700">
                    Manager Role
                  </span>
                </label>
              </div>
              
          </form>
        </div>
        <div className="mt-4 text-right">
          <button
            type="submit"
            className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateEmployee;
