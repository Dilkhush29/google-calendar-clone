import { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { getMonthDays, isInCurrentMonth, isTodayCheck, formatDate, parseISOString } from '../utils/dateUtils';
import { format, isSameDay } from 'date-fns';
import EventModal from './EventModal';
import EventDetailsModal from './EventDetailsModal';

export default function MonthView() {
  const { currentDate, getVisibleEvents } = useCalendar();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  const days = getMonthDays(currentDate);
  const events = getVisibleEvents();

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const eventStart = parseISOString(event.start_time);
      return isSameDay(eventStart, day);
    });
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <div className="flex-1 bg-white overflow-auto custom-scrollbar">
        <div className="grid grid-cols-7 min-h-full">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="border-b border-r border-gray-200 px-2 py-3 text-center text-xs font-medium text-gray-600 bg-gray-50"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isInCurrentMonth(day, currentDate);
            const isToday = isTodayCheck(day);

            return (
              <div
                key={index}
                className={`border-b border-r border-gray-200 min-h-[120px] p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-sm font-medium inline-flex items-center justify-center w-7 h-7 rounded-full ${
                      isToday
                        ? 'bg-calendar-blue-500 text-white'
                        : isCurrentMonth
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Events */}
                <div className="space-y-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const eventColor = event.color || event.calendar_color || '#1a73e8';
                    return (
                      <div
                        key={event.id}
                        className="group relative text-xs px-1.5 py-0.5 rounded cursor-pointer hover:shadow-sm transition-all"
                        style={{
                          backgroundColor: eventColor,
                          borderLeft: `3px solid ${eventColor}`,
                          filter: 'brightness(1.1)',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setIsEventDetailsOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className="w-1 h-1 rounded-full bg-white flex-shrink-0"
                            style={{ opacity: 0.9 }}
                          ></div>
                          <span className="text-white font-medium truncate flex-1">
                            {!event.all_day && (
                              <span className="mr-1">{format(parseISOString(event.start_time), 'h:mm')}</span>
                            )}
                            {event.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <button
                      onClick={() => {
                        setSelectedDate(day);
                        setIsModalOpen(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium pl-2 hover:underline"
                    >
                      +{dayEvents.length - 3} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Creation Modal */}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
        />
      )}

      {/* Event Details Modal */}
      {isEventDetailsOpen && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isEventDetailsOpen}
          onClose={() => {
            setIsEventDetailsOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </>
  );
}
