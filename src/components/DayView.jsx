import { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { getDayHours, parseISOString, calculateEventPosition, calculateEventHeight } from '../utils/dateUtils';
import { format, isSameDay } from 'date-fns';
import EventModal from './EventModal';
import EventDetailsModal from './EventDetailsModal';

export default function DayView() {
  const { currentDate, getVisibleEvents } = useCalendar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  const hours = getDayHours();
  const events = getVisibleEvents().filter((event) => {
    const eventStart = parseISOString(event.start_time);
    return isSameDay(eventStart, currentDate);
  });

  const handleTimeSlotClick = (hour) => {
    const selectedDateTime = new Date(currentDate);
    selectedDateTime.setHours(hour, 0, 0, 0);
    setSelectedTime(selectedDateTime);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex-1 flex bg-white overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="flex">
            {/* Time labels */}
            <div className="w-20 flex-shrink-0 border-r border-gray-200">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-gray-200 pr-3 text-right text-sm text-gray-500"
                >
                  {hour === 0 ? '' : format(new Date().setHours(hour, 0), 'h:mm a')}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="flex-1 border-r border-gray-200 relative">
              {/* Time slots */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleTimeSlotClick(hour)}
                ></div>
              ))}

              {/* Events overlay */}
              {events.map((event) => {
                const startPos = calculateEventPosition(event.start_time);
                const height = calculateEventHeight(event.start_time, event.end_time);

                return (
                  <div
                    key={event.id}
                    className="absolute left-2 right-2 px-3 py-2 rounded shadow cursor-pointer hover:shadow-lg transition-shadow z-10"
                    style={{
                      top: `${startPos * 100}%`,
                      height: `${height * 100}%`,
                      minHeight: '40px',
                      backgroundColor: event.color || event.calendar_color || '#1a73e8',
                      color: 'white',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                      setIsEventDetailsOpen(true);
                    }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-sm opacity-90 mt-1">
                      {format(parseISOString(event.start_time), 'h:mm a')} -{' '}
                      {format(parseISOString(event.end_time), 'h:mm a')}
                    </div>
                    {event.location && (
                      <div className="text-xs opacity-80 mt-1 truncate">{event.location}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Event Creation Modal */}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedTime}
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
