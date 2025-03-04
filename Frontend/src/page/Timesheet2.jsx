/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
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
import { CirclePlus } from "lucide-react";
import { Employee } from "../context/ContextProvider";
import "@schedule-x/theme-default/dist/index.css";

// This component is responsible for initializing the calendar.
// It uses the tasks prop as the events and is re-mounted when the key changes.
function CalendarWrapper({ tasks, eventsService }) {
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: tasks,
    plugins: [eventsService, createEventModalPlugin(), createDragAndDropPlugin()],
    callbacks: {
      onEventUpdate(updatedEvent) {
        console.log("onEventUpdate", updatedEvent);
      },
    },
  });
  return <ScheduleXCalendar calendarApp={calendar} />;
}

function Timesheet2() {
  const navigate = useNavigate();
  const { employeeId } = useContext(Employee);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create a stable eventsService instance.
  const eventsService = useState(() => createEventsServicePlugin())[0];

  // Fetch tasks from the backend and update tasks state.
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Fetching timesheet for Employee ID:", employeeId);
      try {
        const response = await fetch("http://localhost:3000/getTimesheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id: employeeId }),
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedEvents = data.map((task) => ({
            id: String(task.assignment_id),
            title: task.task_name,
            description: task.project_name,
            start: formatDateTime(task.emp_startdate),
            end: formatDateTime(task.emp_enddate),
          }));

          // Guarantee a test event is included
          const testEvent = {
            id: "test-1",
            title: "Test Event",
            start: "2025-03-03 22:00",
            end: "2025-03-03 23:00",
            description: "This is a manually added test event.",
          };

          setTasks([...formattedEvents, testEvent]);
        } else {
          setTasks([]);
        }
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
        {/* Example button if needed */}
        <button
          className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
          onClick={() => navigate(`/create-timeslot`)}
        >
          <CirclePlus className="w-5 h-5" /> Create Timeslot
        </button>
      </div>

      <div className="flex justify-center items-center w-full p-4">
        <div className="w-full max-w-[1400px]">
          {loading ? (
            <p>Loading...</p>
          ) : (
            // Changing the key will force CalendarWrapper to re-mount.
            <CalendarWrapper key={tasks.length} tasks={tasks} eventsService={eventsService} />
          )}
        </div>
      </div>
    </div>
  );
}

// Helper: Format date as "YYYY-MM-DD HH:MM"
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

export default Timesheet2;
