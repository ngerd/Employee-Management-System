import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../context/ContextProvider";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CirclePlus, Pencil } from "lucide-react";
import Alert from "../component/Alert";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Set up moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

/**
 * Modal component for task selection.
 */
function TaskSelectionModal({ tasks, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4">Select a Task</h2>
        {tasks.length === 0 ? (
          <p className="text-center">No tasks available for the selected time range.</p>
        ) : (
          <ul className="list-none p-0">
            {tasks.map((task) => (
              <li key={task.task_id} className="mb-2">
                <button
                  onClick={() => onSelect(task)}
                  className="text-blue-500 underline text-base"
                >
                  {task.task_name} - {task.project_name}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Timesheet() {
  const navigate = useNavigate();
  const { employeeId } = useContext(Employee);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null); // { start, end }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Fetch timesheet events from the backend.
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/getTimesheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId }),
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        const formatted = data.map((item) => ({
          id: item.assignment_id,
          title: item.task_name,
          start: new Date(item.emp_startdate),
          end: new Date(item.emp_enddate),
          meta: {
            taskStart: new Date(item.start_date),
            taskEnd: new Date(item.due_date),
            taskId: item.task_id,
          },
        }));
        setEvents(formatted);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events", error);
      setAlert({ show: true, message: "Error fetching events", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [employeeId]);

  /**
   * Handle empty slot selection to fetch available tasks.
   */
  const handleSelectSlot = async (slotInfo) => {
    const { start, end } = slotInfo;
    setSelectedSlot({ start, end });
    try {
      const response = await fetch(`${backendUrl}/task/getEmployeeTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId }),
      });
      const tasks = await response.json();
      if (Array.isArray(tasks)) {
        const filtered = tasks.filter((task) => {
          const taskStart = new Date(task.start_date);
          const taskEnd = new Date(task.due_date);
          return start >= taskStart && end <= taskEnd;
        });
        setAvailableTasks(filtered);
      } else {
        setAvailableTasks([]);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching tasks", error);
      setAlert({ show: true, message: "Error fetching tasks", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
    }
  };

  /**
   * Create a new timeslot when a task is selected.
   */
  const handleTaskSelect = async (task) => {
    const payload = {
      employee_ids: [employeeId],
      task_id: task.task_id,
      startdate: selectedSlot.start,
      enddate: selectedSlot.end,
    };
    try {
      const response = await fetch(`${backendUrl}/createTimesheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({ show: true, message: "Timeslot created successfully!", type: "success" });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
        setIsModalOpen(false);
        setSelectedSlot(null);
        fetchEvents();
      } else {
        setAlert({ show: true, message: "Failed to create timeslot: " + data.error, type: "error" });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
      }
    } catch (error) {
      console.error("Error creating timeslot", error);
      setAlert({ show: true, message: "Error creating timeslot", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
    }
  };

  /**
   * Update an event's time after dragging/resizing.
   */
  const handleEventDrop = async ({ event, start, end }) => {
    if (event.meta) {
      if (start < event.meta.taskStart || end > event.meta.taskEnd) {
        setAlert({ show: true, message: "New time is outside the allowed range", type: "error" });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
        fetchEvents();
        return;
      }
    }
    try {
      const payload = {
        assignment_id: event.id,
        startdate: start,
        enddate: end,
      };
      const response = await fetch(`${backendUrl}/updateTimesheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({ show: true, message: "Timeslot updated successfully!", type: "success" });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
        fetchEvents();
      } else {
        setAlert({ show: true, message: "Failed to update timeslot: " + data.error, type: "error" });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
        fetchEvents();
      }
    } catch (error) {
      console.error("Error updating timeslot", error);
      setAlert({ show: true, message: "Error updating timeslot", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
      {/* Alert */}
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">
          Timesheet Dashboard
        </h1>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-end mb-4 gap-4">
        <button
          onClick={() => navigate("/create-timeslot")}
          className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
        >
          <CirclePlus className="w-5 h-5" /> Create Timeslot
        </button>
        <button
          onClick={() => navigate("/edit-timeslot")}
          className="flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-white font-medium hover:bg-blue-500"
        >
          <Pencil className="w-5 h-5" /> Edit Timeslot
        </button>
      </div>
      {/* Calendar Container */}
      <div className="rounded-lg shadow-md border border-gray-300 mt-4">
        <div className="p-4 h-[70vh]">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DnDCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              views={["month", "week", "day", "agenda"]}
              view={currentView}
              onView={setCurrentView}
              date={currentDate}
              onNavigate={setCurrentDate}
              toolbar
              onSelectSlot={handleSelectSlot}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventDrop}
              style={{ height: "100%" }}
            />
          )}
        </div>
      </div>
      {/* Task Selection Modal */}
      {isModalOpen && (
        <TaskSelectionModal
          tasks={availableTasks}
          onSelect={handleTaskSelect}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}

export default Timesheet;