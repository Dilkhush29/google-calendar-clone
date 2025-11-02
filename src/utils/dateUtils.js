import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  addMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parse,
  parseISO,
} from 'date-fns';

/**
 * Get all days for a calendar month view (including padding days)
 */
export function getMonthDays(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = [];
  let currentDay = calendarStart;

  while (currentDay <= calendarEnd) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  return days;
}

/**
 * Get all days for a week view
 */
export function getWeekDays(date) {
  const weekStart = startOfWeek(date);
  const days = [];

  for (let i = 0; i < 7; i++) {
    days.push(addDays(weekStart, i));
  }

  return days;
}

/**
 * Get hours for day/week view (0-23)
 */
export function getDayHours() {
  return Array.from({ length: 24 }, (_, i) => i);
}

/**
 * Format date for display
 */
export function formatDate(date, formatStr = 'MMM d, yyyy') {
  return format(date, formatStr);
}

/**
 * Format time for display
 */
export function formatTime(date) {
  return format(date, 'h:mm a');
}

/**
 * Check if date is in current month
 */
export function isInCurrentMonth(date, currentMonth) {
  return isSameMonth(date, currentMonth);
}

/**
 * Check if two dates are the same day
 */
export function isSameDayCheck(date1, date2) {
  return isSameDay(date1, date2);
}

/**
 * Check if date is today
 */
export function isTodayCheck(date) {
  return isToday(date);
}

/**
 * Parse ISO string to Date
 */
export function parseISOString(isoString) {
  return parseISO(isoString);
}

/**
 * Get time string in HH:mm format
 */
export function getTimeString(date) {
  return format(date, 'HH:mm');
}

/**
 * Get date string in yyyy-MM-dd format
 */
export function getDateString(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Combine date and time strings into a Date object
 */
export function combineDateAndTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}`);
}

/**
 * Calculate event position in day/week view based on start time
 */
export function calculateEventPosition(startTime) {
  const date = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return (hours * 60 + minutes) / (24 * 60); // Returns percentage of day (0-1)
}

/**
 * Calculate event height in day/week view based on duration
 */
export function calculateEventHeight(startTime, endTime) {
  const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  const end = typeof endTime === 'string' ? parseISO(endTime) : endTime;
  const durationMinutes = (end - start) / (1000 * 60);
  return durationMinutes / (24 * 60); // Returns percentage of day (0-1)
}

/**
 * Get recurring event instances for a date range
 */
export function getRecurringInstances(event, startDate, endDate) {
  if (!event.is_recurring || !event.recurrence_rule) {
    return [event];
  }

  const instances = [];
  const rule = JSON.parse(event.recurrence_rule);
  const eventStart = parseISO(event.start_time);
  const eventEnd = parseISO(event.end_time);
  const duration = eventEnd - eventStart;

  let currentDate = new Date(eventStart);

  // Generate instances based on recurrence rule
  while (currentDate <= endDate) {
    if (currentDate >= startDate) {
      instances.push({
        ...event,
        start_time: currentDate.toISOString(),
        end_time: new Date(currentDate.getTime() + duration).toISOString(),
        is_recurring_instance: true,
      });
    }

    // Calculate next occurrence
    if (rule.frequency === 'daily') {
      currentDate = addDays(currentDate, rule.interval || 1);
    } else if (rule.frequency === 'weekly') {
      currentDate = addWeeks(currentDate, rule.interval || 1);
    } else if (rule.frequency === 'monthly') {
      currentDate = addMonths(currentDate, rule.interval || 1);
    } else if (rule.frequency === 'yearly') {
      currentDate = addMonths(currentDate, (rule.interval || 1) * 12);
    }

    // Prevent infinite loops
    if (instances.length > 1000) break;
  }

  return instances;
}

/**
 * Check if two events overlap
 */
export function eventsOverlap(event1, event2) {
  const start1 = typeof event1.start_time === 'string' ? parseISO(event1.start_time) : event1.start_time;
  const end1 = typeof event1.end_time === 'string' ? parseISO(event1.end_time) : event1.end_time;
  const start2 = typeof event2.start_time === 'string' ? parseISO(event2.start_time) : event2.start_time;
  const end2 = typeof event2.end_time === 'string' ? parseISO(event2.end_time) : event2.end_time;

  return start1 < end2 && start2 < end1;
}
