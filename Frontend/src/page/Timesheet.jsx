import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

function Timesheet() {
  return (
    <div className="flex flex-col p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full px-20 mt-5 mb-4">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          Timesheet
        </h1>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
          onClick={() => navigate("/create-project")}
        >
          Create time slot
        </button>
      </div>

      {/* Calendar Section */}
      <div className="mt-5">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300 w-fit">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
}

export default Timesheet;
