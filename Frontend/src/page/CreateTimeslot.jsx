import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../context/ContextProvider";
import Alert from "../component/Alert";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CreateTimeslot = () => {
  const { employeeId } = useContext(Employee);
  const navigate = useNavigate();

  // Form state for creating a timeslot
  const [formValues, setFormValues] = useState({
    employee_ids: [employeeId],
    task_id: null,
    startdate: "",
    enddate: "",
  });

  // For the task dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("Choose Task");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Alert for success/error messages
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // This state holds the selected task’s official date range from the DB
  const [taskTime, setTaskTime] = useState(null);

  // 1) Fetch tasks (ensure your backend returns start_date and due_date)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${backendUrl}/task/getEmployeeTask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id: employeeId }),
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchTasks();
    }
  }, [employeeId]);

  // 2) When user selects a task, set taskTime with official range
  const handleSelect = (task) => {
    setSelectedTask(task.task_name);
    setFormValues((prev) => ({
      ...prev,
      task_id: task.task_id,
      // Optionally, auto-fill the start/end inputs:
      // startdate: task.start_date,
      // enddate: task.due_date,
    }));
    setTaskTime({ start: task.start_date, end: task.due_date });
    setIsOpen(false);
  };

  // 3) Helper to format date and time (date next to time)
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const dt = new Date(dateString);
    return dt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 4) Submit form => create timeslot
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/createTimesheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({ show: true, message: "Timeslot created successfully!", type: "success" });
        setTimeout(() => {
          navigate("/timesheet");
        }, 3000);
      } else {
        setAlert({ show: true, message: "Failed to create timeslot: " + data.error, type: "error" });
      }
    } catch (error) {
      console.error("Error creating timeslot:", error);
      setAlert({ show: true, message: "There was a problem creating the timeslot", type: "error" });
    }
  };

  // 5) Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 lg:px-10">
        {alert.show && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ show: false, message: "", type: "" })}
          />
        )}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Create Time Slot</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                <input
                  type="datetime-local"
                  name="startdate"
                  className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  value={formValues.startdate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="enddate"
                  className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  value={formValues.enddate}
                />
              </div>
            </div>

            {/* New: Display official task deadlines in a read-only text field */}
            {taskTime && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Deadlines</label>
                <input
                  type="text"
                  readOnly
                  className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none"
                  value={`${formatDateTime(taskTime.start)} - ${formatDateTime(taskTime.end)}`}
                />
              </div>
            )}

            {/* Task dropdown */}
            <div className="relative mt-7">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md shadow-sm hover:bg-gray-50"
              >
                {selectedTask}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
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
                      <li className="text-center py-2 text-sm text-gray-500">Loading tasks...</li>
                    ) : tasks.length === 0 ? (
                      <li className="text-center py-2 text-sm text-gray-500">No tasks found</li>
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
                className="rounded-lg bg-black px-5 py-3 font-medium text-white cursor-pointer hover:bg-gray-700"
                onClick={() => navigate("/timesheet")}
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-lg bg-black px-5 py-3 font-medium text-white cursor-pointer hover:bg-gray-700"
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
