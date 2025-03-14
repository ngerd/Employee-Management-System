// import { useContext } from 'react';
// import { Employee } from '../context/ContextProvider';
// import MobiscrollCalendar from '../component/MobiscrollCalendar';

// function Timesheet() {
//   const { employeeId } = useContext(Employee);

//   return (
//     <div className="flex flex-col p-4">
//       <h1 className="text-4xl font-bold text-gray-900">Timesheet</h1>
//       {/* Render the Mobiscroll Calendar component and pass any required props */}
//       <MobiscrollCalendar employeeId={employeeId} />
//     </div>
//   );
// }

// export default Timesheet;

import { Draggable, Dropcontainer, Eventcalendar, getJson, setOptions, Toast } from '@mobiscroll/react';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Task({ data }) {
  const [draggable, setDraggable] = useState();

  const eventLength = Math.round(Math.abs(new Date(data.end).getTime() - new Date(data.start).getTime()) / (60 * 60 * 1000));

  return (
    <div>
      {!data.hide && (
        <div ref={setDraggable} className="external-drop-task" style={{ background: data.color }}>
          <div>{data.title}</div>
          <div>{eventLength + ' hour' + (eventLength > 1 ? 's' : '')}</div>
          <Draggable dragData={data} element={draggable} />
        </div>
      )}
    </div>
  );
}

Task.propTypes = {
  data: PropTypes.object.isRequired,
};

function Timesheet() {
  const [dropCont, setDropCont] = useState();
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [myEvents, setEvents] = useState([]);
  const [myTasks, setTasks] = useState([
    {
      id: 1,
      title: 'Product team meeting',
      color: '#cf4343',
      start: '2025-03-13T08:00',
      end: '2025-03-13T09:30',
    },
    {
      id: 2,
      title: 'General orientation',
      color: '#e49516',
      start: '2025-03-13T08:00',
      end: '2025-03-13T10:00',
    },
    {
      id: 3,
      title: 'Client Training',
      color: '#8c429f',
      start: '2025-03-13T10:00',
      end: '2025-03-13T14:00',
    },
    {
      id: 4,
      title: 'CEO Conference',
      color: '#63b548',
      start: '2025-03-13T12:00',
      end: '2025-03-13T18:00',
    },
  ]);

  const myView = useMemo(() => ({ calendar: { labels: true } }), []);

  const handleEventCreate = useCallback(
    (args) => {
      setTasks(myTasks.filter((item) => item.id !== args.event.id));
      setToastMessage(args.event.title + ' added');
      setToastOpen(true);
    },
    [myTasks],
  );

  const handleEventDelete = useCallback((args) => {
    setToastMessage(args.event.title + ' unscheduled');
    setToastOpen(true);
  }, []);

  const handleItemDrop = useCallback((args) => {
    if (args.data) {
      setTasks((myTasks) => [...myTasks, args.data]);
    }
  }, []);

  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Fetching timesheet for Employee ID:", employeeId);
      try {
        const response = await fetch(`${backendUrl}/getTimesheet`, {
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
    <div className="mbsc-grid mbsc-no-padding">
      <div className="mbsc-row">
        <div className="mbsc-col-sm-9 external-drop-calendar">
          <Eventcalendar
            data={myEvents}
            view={myView}
            dragToMove={true}
            dragToCreate={true}
            externalDrop={true}
            externalDrag={true}
            onEventCreate={handleEventCreate}
            onEventDelete={handleEventDelete}
          />
        </div>
        <div className="mbsc-col-sm-3 external-drop-cont" ref={setDropCont}>
          <Dropcontainer onItemDrop={handleItemDrop} element={dropCont}>
            <div className="mbsc-form-group-title">Available tasks</div>
            {myTasks.map((task) => (
              <Task key={task.id} data={task} />
            ))}
          </Dropcontainer>
        </div>
      </div>
      <Toast message={toastMessage} isOpen={isToastOpen} onClose={handleToastClose} />
    </div>
  );
}

export default Timesheet;