/* eslint-disable react/prop-types */
// import React, { useEffect, useState, useContext } from "react";
// import { createEventModalPlugin } from "@schedule-x/event-modal";
// import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
// import { useNavigate } from "react-router-dom";
// import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
// import {
//   createViewDay,
//   createViewMonthAgenda,
//   createViewMonthGrid,
//   createViewWeek,
// } from "@schedule-x/calendar";
// import { createEventsServicePlugin } from "@schedule-x/events-service";
// import { Employee } from "../context/ContextProvider";
// import "@schedule-x/theme-default/dist/index.css";
// import { CirclePlus, Pencil } from "lucide-react";

// function Timesheet() {
//   const navigate = useNavigate();
//   const { employeeId } = useContext(Employee);

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [fetchComplete, setFetchComplete] = useState(false);

//   // Fetch tasks first
//   useEffect(() => {
//     const fetchTasks = async () => {
//       console.log("Fetching timesheet for Employee ID:", employeeId);
//       try {
//         const response = await fetch("http://localhost:3000/getTimesheet", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ employee_id: employeeId }),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (!Array.isArray(data)) {
//           console.warn("Unexpected API response:", data);
//           setTasks([]);
//         } else {
//           const formattedEvents = data.map((task) => ({
//             id: String(task.assignment_id),
//             title: task.task_name,
//             description: task.project_name,
//             start: formatDateTime(task.emp_startdate),
//             end: formatDateTime(task.emp_enddate),
//           }));

//           console.log("Formatted API Events:", formattedEvents);
//           setTasks(formattedEvents);
//         }
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         setTasks([]);
//       } finally {
//         setLoading(false);
//         setFetchComplete(true);
//       }
//     };

//     fetchTasks();
//   }, [employeeId]);

//   // Initialize calendar with tasks only after fetch is complete
//   const calendarApp = useCalendarApp({
//     views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
//     events: tasks,
//     plugins: [createEventsServicePlugin(), createEventModalPlugin(), createDragAndDropPlugin()],
//   });

//   // Debug effect to check for invalid events
//   useEffect(() => {
//     console.log("Current calendar events:", tasks);
//     // Look for any events with invalid dates
//     const invalidEvents = tasks.filter(
//       event => !event.start || !event.end || isNaN(new Date(event.start)) || isNaN(new Date(event.end))
//     );
//     if (invalidEvents.length > 0) {
//       console.warn("Found invalid event dates:", invalidEvents);
//     }
//   }, [tasks]);

//   return (
//     <div className="flex flex-col p-4">
//       <div className="flex items-center justify-between w-full px-20 mt-5 mb-4">
//         <h1 className="text-4xl font-bold text-gray-900">Timesheet</h1>
//         <div className="flex gap-2">
//         <button
//           className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
//           onClick={() => navigate(`/create-timeslot`)}
//         >
//           <CirclePlus className="w-5 h-5" /> Create Timeslot
//         </button>
//           <button
//             className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
//             onClick={() => navigate("/edit-timeslot")}
//           >
//             <Pencil className="w-5 h-5" /> Edit Timeslot
//           </button>
//         </div>
//       </div>

//       <div className="flex justify-center items-center w-full p-4">
//         <div className="w-full max-w-[1400px]">
//           {loading ? (
//             <p>Loading...</p>
//           ) : fetchComplete ? (
//             <ScheduleXCalendar calendarApp={calendarApp} />
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Format date correctly for ScheduleX
// const formatDateTime = (dateString) => {
//   if (!dateString) return "";

//   try {
//     const date = new Date(dateString);
    
//     // Check if date is valid
//     if (isNaN(date.getTime())) {
//       console.warn("Invalid date string:", dateString);
//       return "";
//     }
    
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");

//     return `${year}-${month}-${day} ${hours}:${minutes}`;
//   } catch (error) {
//     console.error("Error formatting date:", error, dateString);
//     return "";
//   }
// };

// export default Timesheet;

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
import { Employee } from "../context/ContextProvider";
import "@schedule-x/theme-default/dist/index.css";
import { CirclePlus, Pencil } from "lucide-react";


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

function Timesheet() {
  // Format date correctly for ScheduleX
  const formatDateTime = (dateString) => {
    if (!dateString) {
      console.warn("Empty date string provided");
      return "";
    }

    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string:", dateString);
        return "";
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      // Schedule X format: "YYYY-MM-DD HH:MM" (24-hour format)
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "";
    }
  };
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

          setTasks([...formattedEvents]);
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

  // Debug rendered calendar
  useEffect(() => {
    if (tasks.length > 0) {
      // Check for date range issues
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      const oneMonthAhead = new Date(now);
      oneMonthAhead.setMonth(now.getMonth() + 1);
      
      const eventsInRange = tasks.filter(event => {
        const startDate = new Date(event.start);
        return startDate >= oneMonthAgo && startDate <= oneMonthAhead;
      });
      
      if (eventsInRange.length === 0 && tasks.length > 0) {
        console.warn("No events in the visible date range (±1 month from today)");
        console.log("Event date ranges:", tasks.map(e => ({ title: e.title, start: e.start, end: e.end })));
      }
    }
  }, [tasks]);

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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Debug info */}
              {tasks.length === 0 && (
                <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
                  <p>No events to display. Check console for debugging information.</p>
                </div>
              )}
              
              <CalendarWrapper key={tasks.length} tasks={tasks} eventsService={eventsService} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timesheet;