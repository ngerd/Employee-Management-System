import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectContext, TaskContext } from "../context/ContextProvider";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const UpdateTask = () => {
  const navigate = useNavigate();
  const { projectId } = useContext(ProjectContext);
  const { currentTaskId } = useContext(TaskContext);
  const [formValues, setFormValues] = useState({
    taskName: "",
    taskDescription: "",
    startDate: "",
    dueDate: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`${backendUrl}/task/info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId : currentTaskId }),
        });
        const data = await response.json();
        if (response.ok) {
          setFormValues({
            taskName: data.task.task_name,
            taskDescription: data.task.task_description,
            startDate: new Date(data.task.start_date).toISOString().slice(0, 16),
            dueDate: new Date(data.task.due_date).toISOString().slice(0, 16),
          });
        } else {
          alert("Failed to fetch task: " + data.error);
        }
      } catch (error) {
        console.error("There was a problem fetching the task:", error);
      }
    };

    if (currentTaskId) {
      fetchTask();
    }
  }, [currentTaskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/task/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formValues, taskId : currentTaskId, projectId }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Task updated successfully!");
        navigate("/project-task");
      } else {
        alert("Failed to update task: " + data.error);
      }
    } catch (error) {
      console.error("There was a problem updating the task:", error);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-12 sm:px-8 lg:px-10 grid grid-cols-1 gap-6">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Update Task</h2>
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
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formValues.startDate}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={formValues.dueDate}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;