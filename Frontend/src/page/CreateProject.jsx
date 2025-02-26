import React from 'react';
import TextInput from '../component/TextInput';
import TextAreaInput from '../component/TextAreaInput';


const CreateProject = () => {
    return (
        <div>
            <section className="bg-gray-100">
                <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
                        <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-1 lg:p-12">
                            <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Create Project</h2>
                            <form action="#" className="space-y-4">
                                <TextInput label="Customer Name" id="CustomerName" name="customer_name" />
                                <TextInput label="Project Name" id="ProjectName" name="project_name" />
                                <TextInput label="Manager Name" id="ManagerName" name="manager_name" />
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <TextAreaInput label="Project Description" id="projectDescription" name="project_description" />
                            </form>
                        </div>

                        <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-1 lg:p-12">
                            <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Accounting</h2>
                            <form action="#" className="space-y-4">
                                <TextInput label="Customer Name" id="CustomerName" name="customer_name" />
                                <TextInput label="Project Name" id="ProjectName" name="project_name" />
                                <TextInput label="Manager Name" id="ManagerName" name="manager_name" />
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <TextAreaInput label="Project Description" id="projectDescription" name="project_description" />
                            </form>
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <button
                            type="submit"
                            className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                        >
                            Create Project
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CreateProject;
