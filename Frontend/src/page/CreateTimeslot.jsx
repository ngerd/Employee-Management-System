import React, { useState, useEffect, useContext, use } from "react";
import { useNavigate } from "react-router-dom";
import { Employee, TaskContext } from "../context/ContextProvider";

const CreateTimeslot = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    employee_ids: [],
    task_id: "",
    startdate: "",
    enddate: "",
  });

  const { employeeId } = useContext(Employee);
  const { taskId, setTaskID } = useContext(TaskContext);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("Choose Task");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // getTimesheet API
  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     console.log("Employee ID: " + employeeId);
  //     try {
  //       const response = await fetch("http://localhost:3000/getTimesheet", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ employee_id: employeeId }),
  //       });
  //       const data = await response.json();

  //       if (Array.isArray(data)) {
  //         setTasks(data);
  //       } else {
  //         setTasks([]);
  //       }
  //       console.log("Fetched tasks:", data);
  //     } catch (error) {
  //       console.error("Error fetching tasks:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTasks();
  // }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelect = (task) => {
    setSelectedTask(task.task_name);
    setFormValues({ ...formValues, task_id: task.task_id });
    setIsOpen(false);
    console.log("task_id " + formValues.task_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      alert("Error: No employee ID found.");
      return;
    }

    const updatedFormValues = {
      ...formValues,
      employee_ids: [employeeId], // Ensure it's an array
    };

    console.log("employee_ids", updatedFormValues.employee_ids);
    console.log("task_id", updatedFormValues.task_id);
    console.log("startdate", updatedFormValues.startdate);
    console.log("enddate", updatedFormValues.enddate);

    try {
      const response = await fetch("http://localhost:3000/createTimesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormValues),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Timeslot added successfully!");
        setFormValues({
          employee_ids: [],
          task_id: "",
          startdate: "",
          enddate: "",
        });
      } else {
        alert("Failed to add task: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("There was a problem adding a task to the project:", error);
    }
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
                  value={formValues.startdate}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="endDateTime"
                  id="enddate"
                  name="enddate"
                  value={formValues.enddate}
                  onChange={handleChange}
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="enddate"
                  name="enddate" // Corrected name
                  value={formValues.enddate} // Ensures state is used
                  onChange={handleChange} // Ensures state updates
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
                        <li key={task.task_id}>
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
                onClick={() => navigate("/timesheet")}
                className="cursor-pointer rounded-lg bg-black hover:bg-gray-700 px-5 py-3 font-medium text-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-black hover:bg-gray-700 px-5 py-3 font-medium text-white"
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
