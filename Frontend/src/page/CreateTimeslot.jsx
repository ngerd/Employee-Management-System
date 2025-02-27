import React, { useState } from "react";

const CreateTimeslot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("Choose Task");

  const task = [
    { id: 1, name: "Design DB Schema" },
    { id: 2, name: "Design UI" },
    { id: 3, name: "Implement feature A" },
    { id: 4, name: "Implement feature B" },
    { id: 5, name: "Implement feature C" },
  ];

  const handleSelect = (task) => {
    setSelectedTask(task.name);
    setIsOpen(false);
    console.log("Selected Role:", task.name); // You can store this in a form state
  };

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl pb-8 font-extrabold text-gray-900">
            Create Time Slot
          </h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="startDateTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  name="startDateTime"
                  className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="endDateTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  name="endDateTime"
                  className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="relative mt-7">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md shadow-sm hover:bg-gray-50"
              >
                {selectedTask}
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
                    {task.map((task) => (
                      <li key={task.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(task)}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {task.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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

export default CreateTimeslot;
