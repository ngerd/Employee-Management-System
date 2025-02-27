import React, { useState } from "react";
import TextInput from "../component/TextInput";
import TextAreaInput from "../component/TextAreaInput";
import Select from "react-select";

const sampleProject = {
  customerName: "ABC Corp",
  projectName: "Website Redesign",
  managerName: "John Doe",
  projectDescription: "Redesigning the company website for better user experience."
};

const employees = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
];

const employeeOptions = employees.map(emp => ({ value: emp.id, label: emp.name }));

const ProjectDetail = () => {
  const [activeTab, setActiveTab] = useState("project");
  const [projectData, setProjectData] = useState(sampleProject);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleAddTask = () => {
    if (taskName && selectedEmployees.length > 0) {
      setTasks([...tasks, { id: tasks.length + 1, name: taskName, description: taskDescription, assignedTo: selectedEmployees }]);
      setTaskName("");
      setTaskDescription("");
      setSelectedEmployees([]);
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div>
      <section className="bg-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-6">
              <button className={`p-3 text-sm font-medium ${activeTab === "project" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("project")}>Project Information</button>
              <button className={`p-3 text-sm font-medium ${activeTab === "tasks" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("tasks")}>Task Information</button>
              <button className={`p-3 text-sm font-medium ${activeTab === "teams" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("teams")}>Teams</button>
            </nav>
          </div>

          {activeTab === "project" && (
            <div className="rounded-lg bg-white p-8 shadow-lg mt-6">
              <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Project Information</h2>
              <form className="space-y-4">
                <TextInput label="Customer Name" name="customerName" value={projectData.customerName} onChange={handleInputChange} />
                <TextInput label="Project Name" name="projectName" value={projectData.projectName} onChange={handleInputChange} />
                <TextInput label="Manager Name" name="managerName" value={projectData.managerName} onChange={handleInputChange} />
                <TextAreaInput label="Project Description" name="projectDescription" value={projectData.projectDescription} onChange={handleInputChange} />
              </form>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="rounded-lg bg-white p-8 shadow-lg mt-6">
              <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Task Information</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-medium">Assign To:</label>
                  <Select
                    options={employeeOptions}
                    isMulti
                    className="w-1/3"
                    value={selectedEmployees}
                    onChange={setSelectedEmployees}
                  />
                </div>
                <input
                  type="text"
                  className="w-1/3 p-2 border rounded-md"
                  placeholder="Task Name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
                <TextAreaInput label="Task Description (Optional)" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
                <button className="w-1/6 bg-blue-500 text-white p-2 rounded-md" onClick={handleAddTask} type="button">Add Task</button>
              </div>
              <ul className="mt-4">
                {tasks.map((task) => (
                  <li key={task.id} className="p-2 border-b flex justify-between items-center">
                    <span>{task.name} - {task.description ? task.description : "No description"} - Assigned to {task.assignedTo.map(emp => emp.label).join(", ")}</span>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "teams" && (
            <div className="rounded-lg bg-white p-8 shadow-lg mt-6">
              <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Teams</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Task</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="border p-2">{task.name}</td>
                      <td className="border p-2">{task.description ? task.description : "No description"}</td>
                      <td className="border p-2">{task.assignedTo.map(emp => emp.label).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
