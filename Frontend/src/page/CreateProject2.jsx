import React, { useState } from "react";

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
      console.log(data);
    } catch (error) {
      console.error("There was a problem creating the project:", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 lg:px-10">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Create Project</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject2;
