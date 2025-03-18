import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../context/ContextProvider";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CirclePlus, Pencil } from "lucide-react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Set up moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);
// Wrap Calendar with drag-and-drop support
const DnDCalendar = withDragAndDrop(Calendar);

/**
 * Modal component for task selection.
 */
function TaskSelectionModal({ tasks, onSelect, onClose }) {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Select a Task</h2>
        {tasks.length === 0 ? (
          <p>No tasks available for the selected time range.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((task) => (
              <li key={task.task_id} style={{ marginBottom: "8px" }}>
                <button onClick={() => onSelect(task)} style={buttonStyle}>
                  {task.task_name} - {task.project_name}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} style={closeButtonStyle}>
          Close
        </button>
      </div>
    </div>
  );
}

// Inline styles for modal overlay and content
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  textAlign: "center",
};
const buttonStyle = {
  background: "none",
  border: "none",
  color: "#007bff",
  cursor: "pointer",
  textDecoration: "underline",
  fontSize: "1rem",
};
const closeButtonStyle = {
  marginTop: "20px",
  padding: "8px 16px",
  backgroundColor: "#ccc",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

function Timesheet() {
  const navigate = useNavigate();
  const { employeeId } = useContext(Employee);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // For new timeslot creation via calendar slot selection.
  const [selectedSlot, setSelectedSlot] = useState(null); // { start, end }
  const [showModal, setShowModal] = useState(false);
  const [availableTasks, setAvailableTasks] = useState([]);

  // Control the current calendar view.
  const [currentView, setCurrentView] = useState("month");
  // Control the current calendar date.
  const [currentDate, setCurrentDate] = useState(new Date());

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [employeeId]);

  /**
   * When the user selects an empty slot, this callback is fired.
   */
  const handleSelectSlot = async (slotInfo) => {
    console.log("Slot selected:", slotInfo);
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
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  /**
   * When a task is selected from the modal, create a new timeslot.
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
        alert("Timeslot created successfully!");
        setShowModal(false);
        setSelectedSlot(null);
        fetchEvents();
      } else {
        alert("Failed to create timeslot: " + data.error);
      }
    } catch (error) {
      console.error("Error creating timeslot", error);
      alert("Error creating timeslot");
    }
  };

  /**
   * When an event is dragged/resized to a new time, update its time.
   */
  const handleEventDrop = async ({ event, start, end }) => {
    if (event.meta) {
      if (start < event.meta.taskStart || end > event.meta.taskEnd) {
        alert("New time is outside the allowed range");
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
        alert("Timeslot updated successfully!");
        fetchEvents();
      } else {
        alert("Failed to update timeslot: " + data.error);
        fetchEvents();
      }
    } catch (error) {
      console.error("Error updating timeslot", error);
      alert("Error updating timeslot");
    }
  };

  return (
    <div className="timesheet-container">
      <div className="header" style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <h1>Timesheet</h1>
        <div>
          <button onClick={() => navigate("/create-timeslot")} style={{ marginRight: "10px" }}>
            <CirclePlus size={20} /> Create Timeslot
          </button>
          <button onClick={() => navigate("/edit-timeslot")}>
            <Pencil size={20} /> Edit Timeslot
          </button>
        </div>
      </div>
      <div style={{ height: "80vh", padding: "10px" }}>
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
            style={{ height: 600 }}
          />
        )}
      </div>
      {showModal && (
        <TaskSelectionModal
          tasks={availableTasks}
          onSelect={handleTaskSelect}
          onClose={() => {
            setShowModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}

export default Timesheet;
