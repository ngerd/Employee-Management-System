// import React, { useState } from "react";
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";

// const AddTask = () => {
//     const [formValues, setFormValues] = useState({
//         projectId: 1,
//         taskName: "",
//         taskDescription: "",
//         startDate: "",
//         dueDate: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormValues({ ...formValues, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("http://localhost:3000/task/add", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(formValues),
//             });
//             const data = await response.json();
//             console.log(data);
//         } catch (error) {
//             console.error("There was a problem adding a task to the project:", error);
//         }
//     };

//     return (
//         <div className="mx-auto max-w-screen-xl px-6 py-12 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="rounded-lg bg-white p-8 shadow-lg">
//                 <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Add Task</h2>
//                 <form className="space-y-4" onSubmit={handleSubmit}>
//                     <input
//                         id="taskName"
//                         name="taskName"
//                         value={formValues.taskName}
//                         onChange={handleChange}
//                         className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
//                         placeholder="Task Name"
//                     />

//                     <textarea
//                         id="taskDescription"
//                         name="taskDescription"
//                         value={formValues.taskDescription}
//                         onChange={handleChange}
//                         className="mt-1 p-2 h-20 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Task Description"
//                     />

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <input
//                             type="date"
//                             id="startDate"
//                             name="startDate"
//                             value={formValues.startDate}
//                             onChange={handleChange}
//                             className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Start Date"
//                         />
//                         <input
//                             type="date"
//                             id="dueDate"
//                             name="dueDate"
//                             value={formValues.dueDate}
//                             onChange={handleChange}
//                             className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Due Date"
//                         />
//                     </div>

//                     <div className="mt-6 text-right">
//                         <button type="submit" className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto">
//                             Add task
//                         </button>
//                     </div>
//                 </form>
//             </div>

//             <div className="rounded-lg bg-white p-8 shadow-lg">
//                 <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Task List</h2>
//                 {/* Add DataTable here if needed */}
//             </div>
//         </div>
//     );
// };

// export default AddTask;



import React, { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const AddTask = () => {
    const [formValues, setFormValues] = useState({
        projectId: 1,
        taskName: "",
        taskDescription: "",
        startDate: "",
        dueDate: "",
    });

    const [tasks, setTasks] = useState([]); // Danh sách công việc
    const [loading, setLoading] = useState(true);

    // Hàm lấy danh sách task
    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:3000/task/list", { // Thay API lấy danh sách task nếu cần
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ projectId: 1 }),
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
        fetchTasks();
    }, []);

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
                body: JSON.stringify(formValues),
            });
            const data = await response.json();

            if (response.ok) {
                alert("Task added successfully!");
                setFormValues({ // Reset form
                    projectId: 1,
                    taskName: "",
                    taskDescription: "",
                    startDate: "",
                    dueDate: "",
                });

                // Cập nhật danh sách task ngay sau khi thêm
                fetchTasks();
            } else {
                alert("Failed to add task: " + data.error);
            }
        } catch (error) {
            console.error("There was a problem adding a task:", error);
        }
    };
    // lg: grid - cols - 2
    return (
        <div className="mx-auto max-w-xl px-6 py-12 sm:px-8 lg:px-10 grid grid-cols-1  gap-6">
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
                        />
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formValues.dueDate}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mt-6 text-right">
                        <button type="submit" className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto">
                            Add task
                        </button>
                    </div>
                </form>
            </div>

            {/* <div className="rounded-lg bg-white p-8 shadow-lg">
                <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Task List</h2>
                <ul className="divide-y divide-gray-200">
                    {tasks.map((task, index) => (
                        <li key={index} className="p-4 bg-gray-100 rounded-lg mb-2">
                            <h3 className="font-bold">{task.taskName}</h3>
                            <p className="text-gray-600">{task.taskDescription}</p>
                            <p className="text-sm text-gray-500">
                                {task.startDate} → {task.dueDate}
                            </p>
                        </li>
                    ))}
                </ul>

            </div> */}
        </div>
    );
};

export default AddTask;
