import { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO } from 'date-fns';
import EventModal from './EventModal';

export default function YearView() {
  const { currentDate, setDate, setView, getVisibleEvents } = useCalendar();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const events = getVisibleEvents();

  // Get all months in the current year
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get days for a specific month
  const getMonthDays = (month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add padding for days before month starts
    const startDay = monthStart.getDay();
    const padding = Array(startDay).fill(null);

    return [...padding, ...days];
  };

  // Check if a date has events
  const hasEvents = (date) => {
    if (!date) return false;
    return events.some(event => {
      const eventDate = parseISO(event.start_time);
      return isSameDay(eventDate, date);
    });
  };

  const handleDayClick = (date) => {
    setDate(date);
    setView('day');
  };

  const handleMonthClick = (month) => {
    setDate(month);
    setView('month');
  };

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="p-6">
        <div className="max-w-7xl mx-auto pb-8">
          {/* Year Title */}
          <h2 className="text-3xl font-normal text-gray-800 mb-8 text-center">
            {format(currentDate, 'yyyy')}
          </h2>

          {/* Grid of 12 months */}
          <div className="grid grid-cols-3 gap-8">
            {months.map((month) => {
              const monthDays = getMonthDays(month);

              return (
                <div
                  key={month.toString()}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Month Header */}
                  <div
                    className="bg-gray-50 px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleMonthClick(month)}
                  >
                    <h3 className="text-sm font-semibold text-gray-900 text-center">
                      {format(month, 'MMMM')}
                    </h3>
                  </div>

                  {/* Month Grid */}
                  <div className="p-2">
                    {/* Week Days Header */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-medium text-gray-500 py-1"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {monthDays.map((day, index) => {
                        const isCurrentMonth = day && isSameMonth(day, month);
                        const isTodayDate = day && isToday(day);
                        const dayHasEvents = day && hasEvents(day);

                        return (
                          <div
                            key={index}
                            onClick={() => day && handleDayClick(day)}
                            className={`
                              aspect-square flex items-center justify-center text-xs relative
                              ${day ? 'cursor-pointer hover:bg-gray-100 rounded' : ''}
                              ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                              ${isTodayDate ? 'bg-blue-600 text-white hover:bg-blue-700 rounded-full font-bold' : ''}
                            `}
                          >
                            {day && (
                              <>
                                <span className="z-10">{format(day, 'd')}</span>
                                {dayHasEvents && !isTodayDate && (
                                  <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-600"></div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
    </div>
  );
}
