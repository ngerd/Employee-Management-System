import React, { useEffect, useState, useContext } from "react";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { useNavigate } from "react-router-dom";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { Employee } from "../context/ContextProvider";
import "@schedule-x/theme-default/dist/index.css";
import { CirclePlus, Pencil } from "lucide-react";

function Timesheet() {
  const navigate = useNavigate();
  const { employeeId } = useContext(Employee);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Calendar Instance
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: tasks,
    plugins: [eventsService, createEventModalPlugin(), createDragAndDropPlugin()],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Fetching timesheet for Employee ID:", employeeId);
      try {
        const response = await fetch("http://localhost:3000/getTimesheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

       const data = await response.json();

        if (!Array.isArray(data)) {
          console.warn("Unexpected API response:", data);
          return setTasks([]);
        }

        const formattedEvents = data.map((task) => ({
          id: String(task.assignment_id),
          title: task.project_name,
          description: task.task_name,
          start: formatDateTime(task.emp_startdate),
          end: formatDateTime(task.emp_enddate),
        }));

        console.log("Formatted API Events:", formattedEvents);
        setTasks(formattedEvents);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [employeeId]);


  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between w-full px-20 mt-5 mb-4">
        <h1 className="text-4xl font-bold text-gray-900">Timesheet</h1>
        <div className="flex gap-2">
        <button
          className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
          onClick={() => navigate(`/create-timeslot`)}
        >
          <CirclePlus className="w-5 h-5" /> Create Timeslot
        </button>
          <button
            className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
            onClick={() => navigate("/edit-timeslot")}
          >
            <Pencil className="w-5 h-5" /> Edit Timeslot
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center w-full p-4">
        <div className="w-full max-w-[1400px]">
          {loading ? <p>Loading...</p> : <ScheduleXCalendar calendarApp={calendar} />}
        </div>
      </div>
    </div>
  );
}

// Format date correctly for ScheduleX
const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export default Timesheet; 