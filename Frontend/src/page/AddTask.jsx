import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/ContextProvider";
import Alert from "../component/Alert";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const AddTask = () => {
  const navigate = useNavigate();
  const { projectId } = useContext(ProjectContext);
  const [formValues, setFormValues] = useState({
    taskName: "",
    taskDescription: "",
    startDate: "",
    dueDate: "",
  });
  const [tasks, setTasks] = useState([]); // Danh sách công việc
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Hàm lấy danh sách task
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/task/list", { // Thay API lấy danh sách task nếu cần
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API lấy danh sách task khi component mount
  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/task/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formValues, projectId }),
      });
      const data = await response.json();

      if (response.ok) {
        setAlert({ show: true, message: "Task added successfully!", type: "success" });
        setFormValues({ // Reset form
          taskName: "",
          taskDescription: "",
          startDate: "",
          dueDate: "",
        });

        // Cập nhật danh sách task ngay sau khi thêm
        fetchTasks();
        setTimeout(() => {
          navigate("/project-task");
        }, 3000); // Delay the navigation by 3 seconds to show the alert
      } else {
        setAlert({ show: true, message: "Failed to add task: " + data.error, type: "error" });
      }
    } catch (error) {
      console.error("There was a problem adding a task to the project:", error);
      setAlert({ show: true, message: "There was a problem adding a task to the project.", type: "error" });
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-12 sm:px-8 lg:px-10 gap-6 ">
      {alert.show && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false, message: "", type: "" })} />}
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Add Task</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            id="taskName"
            name="taskName"
            value={formValues.taskName}
            onChange={handleChange}
            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            placeholder="Task Name"
          />

          <textarea
            id="taskDescription"
            name="taskDescription"
            value={formValues.taskDescription}
            onChange={handleChange}
            className="mt-1 p-2 h-20 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task Description"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formValues.startDate}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formValues.dueDate}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Due Date"
            />
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/project-task")}
              className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
            >
              Back
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
            >
              Add task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;

