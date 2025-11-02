import { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { format, parseISO } from 'date-fns';
import EventModal from './EventModal';

export default function EventDetailsModal({ event, isOpen, onClose }) {
  const { deleteEvent, refreshEvents } = useCalendar();
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen || !event) return null;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      const result = await deleteEvent(event.id);
      if (result.success) {
        onClose();
      } else {
        alert(result.error || 'Failed to delete event');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = async () => {
    setIsEditing(false);
    await refreshEvents();
    onClose();
  };

  if (isEditing) {
    return (
      <EventModal
        isOpen={true}
        onClose={handleCloseEdit}
        event={event}
      />
    );
  }

  const startDate = parseISO(event.start_time);
  const endDate = parseISO(event.end_time);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-800">📅 Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Event Details */}
        <div className="px-6 py-4 space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-2xl font-normal text-gray-900 mb-2">{event.title}</h3>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: event.color || event.calendar_color || '#1a73e8' }}
              ></span>
              <span className="text-sm text-gray-600">{event.calendar_name}</span>
            </div>
          </div>

          {/* Date and Time */}
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-gray-900">
                {format(startDate, 'EEEE, MMMM d, yyyy')}
              </p>
              {!event.all_day && (
                <p className="text-gray-600">
                  {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                </p>
              )}
              {event.all_day && (
                <p className="text-gray-600">All day</p>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-900">{event.location}</p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <p className="text-gray-900 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Recurring */}
          {event.is_recurring && (
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="text-gray-900">Recurring event</p>
                {event.recurrence_rule && (
                  <p className="text-sm text-gray-600">
                    {(() => {
                      try {
                        const rule = JSON.parse(event.recurrence_rule);
                        return `Repeats ${rule.frequency}${rule.interval > 1 ? ` (every ${rule.interval})` : ''}`;
                      } catch {
                        return 'Custom recurrence';
                      }
                    })()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Delete
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md"
            >
              ✏️ EDIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
