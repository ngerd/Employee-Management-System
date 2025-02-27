import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";


import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";

import "@schedule-x/theme-default/dist/index.css";

function Timesheet() {
  // Initialize ScheduleX Calendar
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [
      {
        id: "1",
        title: "Event 1",
        start: "2025-02-27 10:00",
        end: "2025-02-27 12:00",
      },
    ],
    plugins: [
      eventsService,
      createEventModalPlugin(),
      createDragAndDropPlugin()
    ]
    // selectedDate: "2025-02-27"
  });

  useEffect(() => {
    // Fetch all events
    eventsService.getAll();
  }, []);

  return (
    <div className="flex flex-col p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full px-20 mt-5 mb-4">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Timesheet
        </h1>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
          onClick={() => navigate("/create-timeslot")}
        >
          Create Time Slot
        </button>
      </div>

      {/* Calendar Section - Two calendars side by side 
      <div className="flex gap-6 mt-5">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300 w-fit h-fit">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar />
          </LocalizationProvider>
        </div>

        <div className="flex-1 p-4">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>*/}

      <div className="flex justify-center items-center w-full p-4">
        <div className="w-full max-w-[1400px] ">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>
    </div>
  );
}

export default Timesheet;
