import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Employee } from '../context/ContextProvider';

const UpdateTimeslot = () => {
  const navigate = useNavigate();
  const { employeeId } = useContext(Employee);
  const { assignment_id } = useParams();
  const [formValues, setFormValues] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch("http://localhost:3000/getTimesheet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employee_id: employeeId }),
        });
        const data = await response.json();
        if (response.ok && data.length > 0) {
          const timeslot = data.find(slot => slot.assignment_id === parseInt(assignment_id));
          if (timeslot) {
            setFormValues({
              startDate: new Date(timeslot.emp_startdate).toISOString().slice(0, 16),
              endDate: new Date(timeslot.emp_enddate).toISOString().slice(0, 16),
            });
          } else {
            alert("Timeslot not found");
          }
        } else {
          alert("Failed to fetch timeslot: " + (data.error || "No data found"));
        }
      } catch (error) {
        console.error("There was a problem fetching the timeslot:", error);
      }
    };

    if (assignment_id) {
      fetchTask();
    }
  }, [assignment_id, employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/updateTimesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment_id,
          startdate: formValues.startDate,
          enddate: formValues.endDate,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Timeslot updated successfully!");
        navigate("/edit-timeslot");
      } else {
        alert("Failed to update timeslot: " + data.error);
      }
    } catch (error) {
      console.error("There was a problem updating the timeslot:", error);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-12 sm:px-8 lg:px-10 grid grid-cols-1 gap-6">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Update Task</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              id="endDate"
              name="endDate"
              value={formValues.endDate}
              onChange={handleChange}
              className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/edit-timeslot")}
              className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
            >
              Back
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
            >
              Update Timeslot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTimeslot;