import React from 'react';

const Project = () => {
    return (
        <div>
            {/* Top Section: Title, Search Bar, and Create Button */}
            <div className="flex items-center justify-between mb-4">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900">Project List</h2>

                {/* Search Bar in the Center */}
                <div className="flex-grow flex justify-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Create Button on the Right */}
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700">
                    Create
                </button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Name</th>
                            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Date of Birth</th>
                            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Role</th>
                            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Salary</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">John Doe</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">24/05/1995</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">Web Developer</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">$120,000</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <a href="#" className="inline-block rounded-sm bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                                    View
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Jane Doe</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">04/11/1980</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">Web Designer</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">$100,000</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <a href="#" className="inline-block rounded-sm bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                                    View
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Gary Barlow</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">24/05/1995</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">Singer</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">$20,000</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <a href="#" className="inline-block rounded-sm bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                                    View
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Project;
