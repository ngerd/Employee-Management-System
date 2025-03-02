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

import "@schedule-x/theme-default/dist/index.css";

function Timesheet() {
  const navigate = useNavigate();
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
      createDragAndDropPlugin(),
    ],
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
          onClick={() => navigate(`/create-timeslot`)}
          aria-label="Create a new time slot"
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
      <div className="space-y-2 w-2xs ml-11 border-gray-100">
        <details className="overflow-hidden rounded-lg border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
            <span className="text-sm font-medium"> Availability </span>

            <span className="transition group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </summary>

          <div className="border-t border-gray-200 bg-white">
            <ul className="space-y-1 border-t border-gray-200 p-4">
              <li>
                <label
                  htmlFor="FilterInStock"
                  className="inline-flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id="FilterInStock"
                    className="size-5 rounded-sm border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {" "}
                    In Stock (5+){" "}
                  </span>
                </label>
              </li>

              <li>
                <label
                  htmlFor="FilterPreOrder"
                  className="inline-flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id="FilterPreOrder"
                    className="size-5 rounded-sm border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {" "}
                    Pre Order (3+){" "}
                  </span>
                </label>
              </li>

              <li>
                <label
                  htmlFor="FilterOutOfStock"
                  className="inline-flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id="FilterOutOfStock"
                    className="size-5 rounded-sm border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {" "}
                    Out of Stock (10+){" "}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </details>
      </div>

      <div className="flex justify-center items-center w-full p-4">
        <div className="w-full max-w-[1400px] ">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>
    </div>
  );
}

export default Timesheet;
