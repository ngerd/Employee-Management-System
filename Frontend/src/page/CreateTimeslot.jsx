import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../context/ContextProvider";

const CreateTimeslot = () => {
  const { employeeId } = useContext(Employee);
  const [formValues, setFormValues] = useState({
    employee_ids: [employeeId],
    task_id: null,
    startdate: "",
    enddate: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("Choose Task");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Employee ID: " + employeeId);
      try {
        const response = await fetch("http://localhost:3000/task/getEmployeeTask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employee_id: employeeId }),
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
        console.log("Fetched tasks:", data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [employeeId]);

  const handleSelect = (task) => {
    setSelectedTask(task.task_name);
    setFormValues({ ...formValues, task_id: task.task_id });
    console.log(task.task_name,task.task_id);
    setIsOpen(false);
  };
  
  const fetchCreateTimeSlot = async () => {
    console.log("requestData:", formValues);
    try {
      const response = await fetch("http://localhost:3000/createTimesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();

      console.log("Fetched tasks:", data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCreateTimeSlot();
    navigate("/timesheet");
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl pb-8 font-extrabold text-gray-900">
            Create Time Slot
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  id="startdate"
                  name="startdate"
                  className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  value={formValues.startdate}
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
                  id="enddate"
                  name="enddate"
                  onChange={handleChange}
                  value={formValues.enddate}
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
                    {loading ? (
                      <li className="text-center py-2 text-sm text-gray-500">
                        Loading tasks...
                      </li>
                    ) : tasks.length === 0 ? (
                      <li className="text-center py-2 text-sm text-gray-500">
                        No tasks found
                      </li>
                    ) : (
                      tasks.map((task) => (
                        <li key={task.assignment_id}>
                          <button
                            type="button"
                            onClick={() => handleSelect(task)}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {task.task_name} - {task.project_name}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="rounded-lg bg-black px-5 py-3 font-medium text-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-lg bg-black px-5 py-3 font-medium text-white"
              >
                Create Time Slot
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateTimeslot;