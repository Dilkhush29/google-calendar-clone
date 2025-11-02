import { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { getDayHours, parseISOString, calculateEventPosition, calculateEventHeight } from '../utils/dateUtils';
import { format, isSameDay, isToday, addDays } from 'date-fns';
import EventModal from './EventModal';
import EventDetailsModal from './EventDetailsModal';

export default function FourDaysView() {
  const { currentDate, getVisibleEvents } = useCalendar();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  // Get 4 consecutive days starting from current date
  const getFourDays = () => {
    return Array.from({ length: 4 }, (_, i) => addDays(currentDate, i));
  };

  const fourDays = getFourDays();
  const hours = getDayHours();
  const events = getVisibleEvents();

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const eventStart = parseISOString(event.start_time);
      return isSameDay(eventStart, day);
    });
  };

  const handleTimeSlotClick = (day, hour) => {
    const selectedDateTime = new Date(day);
    selectedDateTime.setHours(hour, 0, 0, 0);
    setSelectedDate(selectedDateTime);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Days header */}
        <div className="flex border-b border-gray-200">
          <div className="w-16 flex-shrink-0 border-r border-gray-200"></div>
          {fourDays.map((day, index) => (
            <div
              key={index}
              className={`flex-1 text-center py-3 border-r border-gray-200 ${
                isToday(day) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="text-xs text-gray-600 font-medium">
                {format(day, 'EEE')}
              </div>
              <div
                className={`text-2xl font-normal mt-1 ${
                  isToday(day) ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="flex">
            {/* Time labels */}
            <div className="w-16 flex-shrink-0 border-r border-gray-200">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-12 border-b border-gray-200 pr-2 text-right text-xs text-gray-500"
                >
                  {hour === 0 ? '' : format(new Date().setHours(hour, 0), 'ha')}
                </div>
              ))}
            </div>

            {/* Days grid */}
            {fourDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);

              return (
                <div key={dayIndex} className="flex-1 border-r border-gray-200 relative">
                  {/* Time slots */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-12 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleTimeSlotClick(day, hour)}
                    ></div>
                  ))}

                  {/* Events overlay */}
                  {dayEvents.map((event) => {
                    const startPos = calculateEventPosition(event.start_time);
                    const height = calculateEventHeight(event.start_time, event.end_time);

                    return (
                      <div
                        key={event.id}
                        className="absolute left-0 right-0 mx-1 px-2 py-1 rounded shadow-sm cursor-pointer hover:shadow-md transition-shadow z-10"
                        style={{
                          top: `${startPos * 100}%`,
                          height: `${height * 100}%`,
                          backgroundColor: event.color || event.calendar_color || '#1a73e8',
                          minHeight: '40px',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setIsEventDetailsOpen(true);
                        }}
                      >
                        <div className="text-white text-xs font-medium truncate">
                          {event.title}
                        </div>
                        {!event.all_day && (
                          <div className="text-white text-xs opacity-90 truncate">
                            {format(parseISOString(event.start_time), 'h:mm a')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
        />
      )}

      {/* Event Details Modal */}
      {isEventDetailsOpen && selectedEvent && (
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
