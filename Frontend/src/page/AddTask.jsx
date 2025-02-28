import React, { useState } from "react";
import TextInput from "../component/TextInput";
import TextAreaInput from "../component/TextAreaInput";
import Select from "react-select";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const employees = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Brown" },
];

const employeeOptions = employees.map(emp => ({ value: emp.id, label: emp.name }));

const AddTask = () => {
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAddTask = () => {
        if (taskName && selectedEmployees.length > 0) {
            setTasks([...tasks, {
                id: tasks.length + 1,
                name: taskName,
                description: taskDescription,
                assignedTo: selectedEmployees
            }]);
            setTaskName("");
            setTaskDescription("");
            setSelectedEmployees([]);
        }
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const assignedToTemplate = (rowData) => {
        return rowData.assignedTo.map(emp => emp.label).join(", ");
    };

    return (
        <div className="mx-auto max-w-screen-xl px-6 py-12 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg bg-white p-8 shadow-lg">
                <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Add Task</h2>
                <form className="space-y-4">
                    <TextInput label="Task Name" id="taskName" name="task_name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                    <TextAreaInput label="Task Description (Optional)" id="taskDescription" name="task_description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />

                    <div>
                        <label className="font-medium">Assign To:</label>
                        <Select
                            options={employeeOptions}
                            isMulti
                            className="w-full mt-2"
                            value={selectedEmployees}
                            onChange={setSelectedEmployees}
                        />
                    </div>

                    <button
                        type="button"
                        className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                        onClick={handleAddTask}
                    >
                        Add Task
                    </button>
                </form>

                <ul className="mt-6">
                    {tasks.map((task) => (
                        <li key={task.id} className="p-2 border-b flex justify-between items-center">
                            <span>{task.name} - {task.description || "No description"} - Assigned to {task.assignedTo.map(emp => emp.label).join(", ")}</span>
                            <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-lg">
                <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Task List</h2>
                <DataTable
                    value={tasks}
                    paginator
                    rows={5}
                    loading={loading}
                    dataKey="name"
                    emptyMessage="No task found."
                    showGridlines
                    className="rounded-lg shadow-md border border-gray-300 mt-4 z-10"
                >
                    {/* <Column field="id" header="ID" style={{ minWidth: '5rem' }} /> */}
                    <Column field="name" header="Task Name" style={{ minWidth: '10rem' }} />
                    <Column field="assignedTo" header="Assigned To" body={assignedToTemplate} style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default AddTask;
