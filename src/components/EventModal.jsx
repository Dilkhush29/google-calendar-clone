import { useState, useEffect } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { format } from 'date-fns';

export default function EventModal({ isOpen, onClose, selectedDate, event = null }) {
  const { calendars, createEvent, updateEvent, deleteEvent } = useCalendar();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    calendarId: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    allDay: false,
    location: '',
    color: '#1a73e8',
    isRecurring: false,
    recurrenceFrequency: 'daily',
    recurrenceInterval: 1,
  });

  useEffect(() => {
    if (event) {
      // Edit mode
      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);

      setFormData({
        title: event.title || '',
        description: event.description || '',
        calendarId: event.calendar_id || '',
        startDate: format(startDate, 'yyyy-MM-dd'),
        startTime: format(startDate, 'HH:mm'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        endTime: format(endDate, 'HH:mm'),
        allDay: event.all_day || false,
        location: event.location || '',
        color: event.color || '#1a73e8',
        isRecurring: event.is_recurring || false,
        recurrenceFrequency: 'daily',
        recurrenceInterval: 1,
      });
    } else if (selectedDate) {
      // Create mode with selected date
      const start = new Date(selectedDate);
      const end = new Date(selectedDate);
      end.setHours(end.getHours() + 1);

      setFormData(prev => ({
        ...prev,
        calendarId: calendars.find(c => c.is_default)?.id || calendars[0]?.id || '',
        startDate: format(start, 'yyyy-MM-dd'),
        startTime: format(start, 'HH:mm'),
        endDate: format(end, 'yyyy-MM-dd'),
        endTime: format(end, 'HH:mm'),
      }));
    }
  }, [event, selectedDate, calendars]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    const eventData = {
      calendarId: formData.calendarId,
      title: formData.title,
      description: formData.description,
      startTime: `${formData.startDate}T${formData.startTime}:00`,
      endTime: `${formData.endDate}T${formData.endTime}:00`,
      allDay: formData.allDay,
      location: formData.location,
      color: formData.color,
      isRecurring: formData.isRecurring,
      recurrenceRule: formData.isRecurring
        ? JSON.stringify({
            frequency: formData.recurrenceFrequency,
            interval: formData.recurrenceInterval,
          })
        : null,
    };

    if (event) {
      const result = await updateEvent(event.id, eventData);
      if (result.success) {
        onClose();
      } else {
        alert(result.error || 'Failed to update event');
      }
    } else {
      const result = await createEvent(eventData);
      if (result.success) {
        onClose();
      } else {
        alert(result.error || 'Failed to create event');
      }
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-normal text-gray-800">
            {event ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Add title"
              className="w-full text-2xl font-normal border-b-2 border-gray-300 focus:border-calendar-blue-500 outline-none py-2"
              required
            />
          </div>

          {/* Calendar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Calendar</label>
            <select
              name="calendarId"
              value={formData.calendarId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calendar-blue-500 focus:border-calendar-blue-500 outline-none"
              required
            >
              {!formData.calendarId && <option value="">Select a calendar</option>}
              {calendars.map((cal) => (
                <option key={cal.id} value={cal.id}>
                  {cal.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calendar-blue-500 focus:border-calendar-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                disabled={formData.allDay}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calendar-blue-500 focus:border-calendar-blue-500 disabled:bg-gray-100 outline-none"
                required={!formData.allDay}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calendar-blue-500 focus:border-calendar-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                disabled={formData.allDay}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calendar-blue-500 focus:border-calendar-blue-500 disabled:bg-gray-100 outline-none"
                required={!formData.allDay}
              />
            </div>
          </div>

          {/* All Day Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="allDay"
              id="allDay"
              checked={formData.allDay}
              onChange={handleChange}
              className="w-4 h-4 text-calendar-blue-500 border-gray-300 rounded focus:ring-calendar-blue-500"
            />
            <label htmlFor="allDay" className="ml-2 text-sm text-gray-700">
              All day event
            </label>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Add location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calendar-blue-500 focus:border-calendar-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add description"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calendar-blue-500 focus:border-calendar-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color (optional)</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
          </div>

          {/* Recurring Event */}
          <div>
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                name="isRecurring"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="w-4 h-4 text-calendar-blue-500 border-gray-300 rounded focus:ring-calendar-blue-500"
              />
              <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700">
                Recurring event
              </label>
            </div>

            {formData.isRecurring && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    name="recurrenceFrequency"
                    value={formData.recurrenceFrequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calendar-blue-500 focus:border-calendar-blue-500 outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Repeat every</label>
                  <input
                    type="number"
                    name="recurrenceInterval"
                    value={formData.recurrenceInterval}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calendar-blue-500 focus:border-calendar-blue-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              {event && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Delete Event
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-calendar-blue-500 hover:bg-calendar-blue-600 rounded transition-colors"
              >
                {event ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
