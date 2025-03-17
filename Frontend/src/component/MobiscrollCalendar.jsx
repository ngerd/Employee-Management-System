import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Draggable,
  Dropcontainer,
  Eventcalendar,
  getJson,
  setOptions,
  Toast,
} from '@mobiscroll/react';
import PropTypes from 'prop-types';

setOptions({
  theme: 'ios',
  themeVariant: 'light',
});

// Task component for draggable tasks
function Task({ data }) {
  const [draggable, setDraggable] = useState();
  const eventLength = Math.round(
    Math.abs(new Date(data.end).getTime() - new Date(data.start).getTime()) /
      (60 * 60 * 1000)
  );

  return (
    <div>
      {!data.hide && (
        <div
          ref={setDraggable}
          className="external-drop-task"
          style={{ background: data.color }}
        >
          <div>{data.title}</div>
          <div>
            {eventLength} {eventLength > 1 ? 'hours' : 'hour'}
          </div>
          <Draggable dragData={data} element={draggable} />
        </div>
      )}
    </div>
  );
}

Task.propTypes = {
  data: PropTypes.object.isRequired,
};

function MobiscrollCalendar({ employeeId }) {
  const [dropCont, setDropCont] = useState(null);
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [myEvents, setEvents] = useState([]);
  const [myTasks, setTasks] = useState([
    // You can preload tasks or fetch them from your API as needed.
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

  // Example: fetching existing events from your backend
  useEffect(() => {
    fetch('http://localhost:3000/getTimesheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Format your fetched data to match the Mobiscroll Eventcalendar expectations.
        const formattedEvents = data.map((event) => ({
          id: event.assignment_id,
          title: event.task_name,
          start: event.emp_startdate,
          end: event.emp_enddate,
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error('Error fetching timesheet: ', error));
  }, [employeeId]);

  // Optionally load external events
  useEffect(() => {
    getJson(
      'https://trial.mobiscroll.com/drag-drop-events/',
      (events) => {
        setEvents(events);
      },
      'jsonp'
    );
  }, []);

  const myView = useMemo(() => ({ calendar: { labels: true } }), []);

  const handleEventCreate = useCallback((args) => {
    // When an event is created, remove it from the tasks list and show a toast message.
    setTasks((prev) => prev.filter((item) => item.id !== args.event.id));
    setToastMessage(`${args.event.title} added`);
    setToastOpen(true);
  }, []);

  const handleEventDelete = useCallback((args) => {
    setToastMessage(`${args.event.title} unscheduled`);
    setToastOpen(true);
  }, []);

  const handleItemDrop = useCallback((args) => {
    if (args.data) {
      setTasks((prev) => [...prev, args.data]);
    }
  }, []);

  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);

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
      <Toast
        message={toastMessage}
        isOpen={isToastOpen}
        onClose={handleToastClose}
      />
    </div>
  );
}

MobiscrollCalendar.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default MobiscrollCalendar;