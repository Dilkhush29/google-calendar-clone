import { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { format, isSameDay, isToday as isTodayFn } from 'date-fns';
import { getMonthDays } from '../utils/dateUtils';
import EventModal from './EventModal';

export default function Sidebar() {
  const {
    calendars,
    toggleCalendar,
    selectedCalendarIds,
    currentDate,
    setDate,
    setSearchQuery,
    createCalendar,
    showHolidays,
    showBirthdays,
    toggleHolidays,
    toggleBirthdays,
    holidaysCount
  } = useCalendar();
  const [showAddCalendar, setShowAddCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [newCalendarColor, setNewCalendarColor] = useState('#1a73e8');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCalendars, setShowCalendars] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  const [showOtherCalendars, setShowOtherCalendars] = useState(true);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Sample Task 1', completed: false },
    { id: 2, title: 'Sample Task 2', completed: true },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const miniCalendarDays = getMonthDays(new Date());
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTaskTitle, completed: false }]);
    setNewTaskTitle('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleAddCalendar = async () => {
    if (!newCalendarName.trim()) return;

    await createCalendar(newCalendarName, newCalendarColor);
    setNewCalendarName('');
    setNewCalendarColor('#1a73e8');
    setShowAddCalendar(false);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Create Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowCreateEvent(true)}
          className="w-full flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-700 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-calendar-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-3">
          {format(new Date(), 'MMMM yyyy')}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day, i) => (
            <div key={i} className="text-xs text-gray-500 font-medium py-1">
              {day}
            </div>
          ))}
          {miniCalendarDays.map((day, index) => {
            const isToday = isTodayFn(day);
            const isSelected = isSameDay(day, currentDate);
            const isCurrentMonth = day.getMonth() === new Date().getMonth();

            return (
              <button
                key={index}
                onClick={() => setDate(day)}
                className={`text-xs py-1 rounded-full transition-colors ${
                  isToday
                    ? 'bg-calendar-blue-500 text-white font-medium'
                    : isSelected
                    ? 'bg-gray-200 text-gray-900'
                    : isCurrentMonth
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-400'
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* My Calendars */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowCalendars(!showCalendars)}
            className="flex items-center justify-between w-full mb-3 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-900">My Calendars</h3>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${showCalendars ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showCalendars && (
            <>
              {showAddCalendar && (
                <div className="mb-3 p-3 bg-gray-50 rounded-md">
                  <input
                    type="text"
                    value={newCalendarName}
                    onChange={(e) => setNewCalendarName(e.target.value)}
                    placeholder="Calendar name"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="color"
                      value={newCalendarColor}
                      onChange={(e) => setNewCalendarColor(e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-xs text-gray-600">Choose color</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCalendar}
                      className="flex-1 px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddCalendar(false);
                        setNewCalendarName('');
                        setNewCalendarColor('#1a73e8');
                      }}
                      className="flex-1 px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-0.5">
                {calendars.map((calendar) => (
                  <label
                    key={calendar.id}
                    className="flex items-center px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCalendarIds.includes(calendar.id)}
                      onChange={() => toggleCalendar(calendar.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                      style={{
                        accentColor: calendar.color,
                      }}
                    />
                    <span
                      className="w-3 h-3 rounded-full ml-2 mr-2"
                      style={{ backgroundColor: calendar.color }}
                    ></span>
                    <span className="text-sm text-gray-700 truncate flex-1">{calendar.name}</span>
                  </label>
                ))}

                <button
                  onClick={() => setShowAddCalendar(!showAddCalendar)}
                  className="flex items-center w-full px-2 py-1.5 hover:bg-gray-100 rounded text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4 mr-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add calendar
                </button>
              </div>
            </>
          )}
        </div>

        {/* Tasks */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowTasks(!showTasks)}
            className="flex items-center justify-between w-full mb-3 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-900">Tasks</h3>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${showTasks ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showTasks && (
            <div className="space-y-2">
              {/* Add Task Input */}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add a task"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addTask}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Add task"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Task List */}
              <div className="space-y-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg group transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                    />
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                      title="Delete task"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No tasks yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Other Calendars */}
        <div className="p-4">
          <button
            onClick={() => setShowOtherCalendars(!showOtherCalendars)}
            className="flex items-center justify-between w-full mb-3 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-900">Other calendars</h3>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${showOtherCalendars ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showOtherCalendars && (
            <div className="space-y-0.5">
              {/* Holidays */}
              <label className="flex items-center px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  checked={showHolidays}
                  onChange={toggleHolidays}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer"
                  style={{ accentColor: '#16a34a' }}
                />
                <svg className="w-4 h-4 ml-2 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="text-sm text-gray-700 flex-1">Holidays in India</span>
                <span className="text-xs text-gray-400">{holidaysCount}</span>
              </label>

              {/* Birthdays */}
              <label className="flex items-center px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  checked={showBirthdays}
                  onChange={toggleBirthdays}
                  className="w-4 h-4 rounded border-gray-300 text-pink-600 cursor-pointer"
                  style={{ accentColor: '#db2777' }}
                />
                <svg className="w-4 h-4 ml-2 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700 flex-1">Birthdays</span>
                <span className="text-xs text-gray-400">0</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <EventModal
          isOpen={showCreateEvent}
          onClose={() => setShowCreateEvent(false)}
          selectedDate={new Date()}
        />
      )}
    </aside>
  );
}
