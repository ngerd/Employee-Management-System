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
import { Info, ClipboardList, Users, CirclePlus, Download, Pencil } from "lucide-react";

function Timesheet() {
  const navigate = useNavigate();
  const { employeeId } = useContext(Employee);

  // Create event service plugin
  const eventsServicePlugin = useState(() => createEventsServicePlugin())[0];

  // Initialize ScheduleX Calendar
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    plugins: [
      eventsServicePlugin,
      createEventModalPlugin(),
      createDragAndDropPlugin(),
    ],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Fetching timesheet for Employee ID:", employeeId);
      try {
        const response = await fetch("http://localhost:3000/getTimesheet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employee_id: employeeId }),
        });

       const data = await response.json();

        if (Array.isArray(data)) {
          data.forEach((task) => {
            const formattedEvent = {
              id: task.assignment_id,
              title: task.task_name,
              start: task.emp_startdate.replace("T", " ").slice(0, 16), // Format to 'YYYY-MM-DD HH:mm'
              end: task.emp_enddate.replace("T", " ").slice(0, 16),
            };

            eventsServicePlugin.add(formattedEvent);
          });
        } else {
          console.error("Invalid API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [employeeId]);

  // Add a hardcoded test event
  useEffect(() => {
    const testEvent = {
      id: 999,
      title: "Test Event",
      start: "2025-03-10 14:00",
      end: "2025-03-10 16:00",
    };
    eventsServicePlugin.add(testEvent);
  }, []);

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between py-4 px-11">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Time Schedule
        </h1>
        <div className="flex gap-2">
        <button
          className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
          onClick={() => navigate(`/create-timeslot`)}
        >
          <CirclePlus className="w-5 h-5" /> Create imeslot
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
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>
    </div>
  );
}

export default Timesheet; 