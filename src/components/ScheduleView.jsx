import { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import EventDetailsModal from './EventDetailsModal';

export default function ScheduleView() {
  const { currentDate, getVisibleEvents } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  const events = getVisibleEvents();

  // Get all days in current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group events by day
  const eventsByDay = daysInMonth.map(day => {
    const dayEvents = events
      .filter(event => {
        const eventDate = parseISO(event.start_time);
        return isSameDay(eventDate, day);
      })
      .sort((a, b) => {
        if (a.all_day && !b.all_day) return -1;
        if (!a.all_day && b.all_day) return 1;
        return new Date(a.start_time) - new Date(b.start_time);
      });

    return {
      date: day,
      events: dayEvents
    };
  }).filter(dayData => dayData.events.length > 0); // Only show days with events

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {eventsByDay.reduce((total, day) => total + day.events.length, 0)} events this month
          </p>
        </div>

        {/* Events List */}
        {eventsByDay.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-lg">No events scheduled</p>
            <p className="text-gray-400 text-sm mt-1">Click "Create" to add an event</p>
          </div>
        ) : (
          <div className="space-y-6">
            {eventsByDay.map(({ date, events: dayEvents }) => {
              const isTodayDate = isToday(date);

              return (
                <div key={date.toString()} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Date Header */}
                  <div className={`px-6 py-3 border-b border-gray-200 ${isTodayDate ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-3xl font-light ${isTodayDate ? 'text-blue-600' : 'text-gray-900'}`}>
                        {format(date, 'd')}
                      </span>
                      <div>
                        <span className={`text-sm font-medium ${isTodayDate ? 'text-blue-600' : 'text-gray-700'}`}>
                          {format(date, 'EEEE')}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {format(date, 'MMMM yyyy')}
                        </span>
                      </div>
                      {isTodayDate && (
                        <span className="ml-auto text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Today
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Events for this day */}
                  <div className="divide-y divide-gray-100">
                    {dayEvents.map((event) => {
                      const eventColor = event.color || event.calendar_color || '#1a73e8';
                      const isHoliday = event.isHoliday;

                      return (
                        <div
                          key={event.id}
                          onClick={() => !isHoliday && handleEventClick(event)}
                          className={`px-6 py-4 hover:bg-gray-50 transition-colors ${!isHoliday ? 'cursor-pointer' : ''}`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Time */}
                            <div className="flex-shrink-0 w-24 pt-0.5">
                              {event.all_day ? (
                                <span className="text-xs text-gray-500 font-medium">All day</span>
                              ) : (
                                <span className="text-sm text-gray-700 font-medium">
                                  {format(parseISO(event.start_time), 'h:mm a')}
                                </span>
                              )}
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3">
                                {/* Color Indicator */}
                                <div
                                  className="flex-shrink-0 w-1 h-16 rounded-full mt-0.5"
                                  style={{ backgroundColor: eventColor }}
                                />

                                <div className="flex-1 min-w-0">
                                  {/* Title */}
                                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                                    {event.title}
                                  </h3>

                                  {/* Time range for non-all-day events */}
                                  {!event.all_day && (
                                    <p className="text-xs text-gray-500 mb-1">
                                      {format(parseISO(event.start_time), 'h:mm a')} - {format(parseISO(event.end_time), 'h:mm a')}
                                    </p>
                                  )}

                                  {/* Description */}
                                  {event.description && (
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                      {event.description}
                                    </p>
                                  )}

                                  {/* Location */}
                                  {event.location && (
                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      <span className="truncate">{event.location}</span>
                                    </div>
                                  )}

                                  {/* Calendar Name */}
                                  <div className="flex items-center gap-1 mt-2">
                                    <span
                                      className="inline-block w-2 h-2 rounded-full"
                                      style={{ backgroundColor: eventColor }}
                                    />
                                    <span className="text-xs text-gray-500">
                                      {event.calendar_name || 'My Calendar'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
    </div>
  );
}
