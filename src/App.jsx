import { useAuth } from './contexts/AuthContext';
import { useCalendar } from './contexts/CalendarContext';
import Auth from './components/Auth';
import CalendarHeader from './components/CalendarHeader';
import Sidebar from './components/Sidebar';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import YearView from './components/YearView';
import ScheduleView from './components/ScheduleView';
import FourDaysView from './components/FourDaysView';

function App() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const { currentView } = useCalendar();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-calendar-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          <CalendarHeader />

          {/* Calendar View */}
          <div className="flex-1 overflow-hidden">
            {currentView === 'month' && <MonthView />}
            {currentView === 'week' && <WeekView />}
            {currentView === 'day' && <DayView />}
            {currentView === 'year' && <YearView />}
            {currentView === 'schedule' && <ScheduleView />}
            {currentView === '4days' && <FourDaysView />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
