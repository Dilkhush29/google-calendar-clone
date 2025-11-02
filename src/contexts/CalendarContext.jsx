import { createContext, useContext, useReducer, useEffect } from 'react';
import { calendarsAPI, eventsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CalendarContext = createContext();

// Indian Holidays data
const HOLIDAYS = [
  { date: '2025-01-01', title: 'New Year\'s Day', country: 'India' },
  { date: '2025-01-14', title: 'Makar Sankranti', country: 'India' },
  { date: '2025-01-26', title: 'Republic Day', country: 'India' },
  { date: '2025-02-26', title: 'Maha Shivaratri', country: 'India' },
  { date: '2025-03-14', title: 'Holi', country: 'India' },
  { date: '2025-03-30', title: 'Ram Navami', country: 'India' },
  { date: '2025-03-31', title: 'Eid ul-Fitr', country: 'India' },
  { date: '2025-04-06', title: 'Mahavir Jayanti', country: 'India' },
  { date: '2025-04-13', title: 'Baisakhi', country: 'India' },
  { date: '2025-04-18', title: 'Good Friday', country: 'India' },
  { date: '2025-05-12', title: 'Buddha Purnima', country: 'India' },
  { date: '2025-06-07', title: 'Eid ul-Adha', country: 'India' },
  { date: '2025-08-15', title: 'Independence Day', country: 'India' },
  { date: '2025-08-16', title: 'Janmashtami', country: 'India' },
  { date: '2025-08-27', title: 'Onam', country: 'India' },
  { date: '2025-09-05', title: 'Ganesh Chaturthi', country: 'India' },
  { date: '2025-10-02', title: 'Gandhi Jayanti', country: 'India' },
  { date: '2025-10-02', title: 'Dussehra', country: 'India' },
  { date: '2025-10-20', title: 'Diwali', country: 'India' },
  { date: '2025-11-05', title: 'Guru Nanak Jayanti', country: 'India' },
  { date: '2025-12-25', title: 'Christmas Day', country: 'India' },
];

const initialState = {
  calendars: [],
  events: [],
  selectedCalendarIds: [],
  currentView: 'month', // 'month', 'week', 'day', 'year', 'schedule', '4days'
  currentDate: new Date(),
  isLoading: false,
  error: null,
  searchQuery: '',
  showHolidays: true,
  showBirthdays: false,
};

function calendarReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CALENDARS':
      return { ...state, calendars: action.payload };
    case 'ADD_CALENDAR':
      return { ...state, calendars: [...state.calendars, action.payload] };
    case 'UPDATE_CALENDAR':
      return {
        ...state,
        calendars: state.calendars.map((cal) =>
          cal.id === action.payload.id ? action.payload : cal
        ),
      };
    case 'DELETE_CALENDAR':
      return {
        ...state,
        calendars: state.calendars.filter((cal) => cal.id !== action.payload),
        selectedCalendarIds: state.selectedCalendarIds.filter((id) => id !== action.payload),
      };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case 'TOGGLE_CALENDAR':
      return {
        ...state,
        selectedCalendarIds: state.selectedCalendarIds.includes(action.payload)
          ? state.selectedCalendarIds.filter((id) => id !== action.payload)
          : [...state.selectedCalendarIds, action.payload],
      };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_DATE':
      return { ...state, currentDate: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_HOLIDAYS':
      return { ...state, showHolidays: !state.showHolidays };
    case 'TOGGLE_BIRTHDAYS':
      return { ...state, showBirthdays: !state.showBirthdays };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

export function CalendarProvider({ children }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Fetch calendars when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCalendars();
    }
  }, [isAuthenticated]);

  // Fetch events when calendars or date changes
  useEffect(() => {
    if (isAuthenticated && state.calendars.length > 0) {
      fetchEvents();
    }
  }, [isAuthenticated, state.calendars.length, state.currentDate, state.currentView, state.searchQuery]);

  const fetchCalendars = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await calendarsAPI.getAll();
      const calendars = response.data.calendars;
      dispatch({ type: 'SET_CALENDARS', payload: calendars });

      // Auto-select all calendars initially
      const calendarIds = calendars.map((cal) => cal.id);
      calendarIds.forEach((id) => {
        dispatch({ type: 'TOGGLE_CALENDAR', payload: id });
      });

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error fetching calendars:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch calendars' });
    }
  };

  const fetchEvents = async () => {
    try {
      // Calculate date range based on current view
      const startDate = new Date(state.currentDate);
      const endDate = new Date(state.currentDate);

      if (state.currentView === 'month') {
        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
      } else if (state.currentView === 'week') {
        const day = startDate.getDay();
        startDate.setDate(startDate.getDate() - day);
        endDate.setDate(startDate.getDate() + 6);
      } else if (state.currentView === 'day') {
        endDate.setDate(endDate.getDate() + 1);
      }

      const params = {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };

      if (state.searchQuery) {
        params.search = state.searchQuery;
      }

      const response = await eventsAPI.getAll(params);
      dispatch({ type: 'SET_EVENTS', payload: response.data.events });
    } catch (error) {
      console.error('Error fetching events:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch events' });
    }
  };

  const createCalendar = async (name, color) => {
    try {
      const response = await calendarsAPI.create({ name, color });
      dispatch({ type: 'ADD_CALENDAR', payload: response.data.calendar });
      dispatch({ type: 'TOGGLE_CALENDAR', payload: response.data.calendar.id });
      return { success: true };
    } catch (error) {
      console.error('Error creating calendar:', error);
      return { success: false, error: error.response?.data?.error };
    }
  };

  const updateCalendar = async (id, data) => {
    try {
      const response = await calendarsAPI.update(id, data);
      dispatch({ type: 'UPDATE_CALENDAR', payload: response.data.calendar });
      return { success: true };
    } catch (error) {
      console.error('Error updating calendar:', error);
      return { success: false, error: error.response?.data?.error };
    }
  };

  const deleteCalendar = async (id) => {
    try {
      await calendarsAPI.delete(id);
      dispatch({ type: 'DELETE_CALENDAR', payload: id });
      return { success: true };
    } catch (error) {
      console.error('Error deleting calendar:', error);
      return { success: false, error: error.response?.data?.error };
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await eventsAPI.create(eventData);
      dispatch({ type: 'ADD_EVENT', payload: response.data.event });
      return { success: true, event: response.data.event };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.response?.data?.error };
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const response = await eventsAPI.update(id, eventData);
      dispatch({ type: 'UPDATE_EVENT', payload: response.data.event });
      return { success: true };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.response?.data?.error };
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventsAPI.delete(id);
      dispatch({ type: 'DELETE_EVENT', payload: id });
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.response?.data?.error };
    }
  };

  const toggleCalendar = (calendarId) => {
    dispatch({ type: 'TOGGLE_CALENDAR', payload: calendarId });
  };

  const setView = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const setDate = (date) => {
    dispatch({ type: 'SET_DATE', payload: date });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(state.currentDate);

    if (state.currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (state.currentView === 'week') {
      newDate.setDate(newDate.getDate() + (7 * direction));
    } else if (state.currentView === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (state.currentView === 'year') {
      newDate.setFullYear(newDate.getFullYear() + direction);
    } else if (state.currentView === 'schedule') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (state.currentView === '4days') {
      newDate.setDate(newDate.getDate() + (4 * direction));
    }

    dispatch({ type: 'SET_DATE', payload: newDate });
  };

  const goToToday = () => {
    dispatch({ type: 'SET_DATE', payload: new Date() });
  };

  const toggleHolidays = () => {
    dispatch({ type: 'TOGGLE_HOLIDAYS' });
  };

  const toggleBirthdays = () => {
    dispatch({ type: 'TOGGLE_BIRTHDAYS' });
  };

  const getHolidayEvents = () => {
    if (!state.showHolidays) return [];

    // Convert holidays to event format
    return HOLIDAYS.map((holiday, index) => ({
      id: `holiday-${index}`,
      title: holiday.title,
      start_time: `${holiday.date}T00:00:00`,
      end_time: `${holiday.date}T23:59:59`,
      all_day: true,
      color: '#16a34a',
      calendar_color: '#16a34a',
      calendar_name: 'Holidays in India',
      isHoliday: true,
    }));
  };

  const getVisibleEvents = () => {
    const regularEvents = state.events.filter((event) =>
      state.selectedCalendarIds.includes(event.calendar_id)
    );
    const holidayEvents = getHolidayEvents();
    return [...regularEvents, ...holidayEvents];
  };

  const value = {
    ...state,
    createCalendar,
    updateCalendar,
    deleteCalendar,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleCalendar,
    setView,
    setDate,
    setSearchQuery,
    navigateDate,
    goToToday,
    getVisibleEvents,
    refreshEvents: fetchEvents,
    toggleHolidays,
    toggleBirthdays,
    holidaysCount: HOLIDAYS.length,
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
