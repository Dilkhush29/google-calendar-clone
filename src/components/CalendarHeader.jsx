import { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

export default function CalendarHeader() {
  const { currentDate, currentView, setView, navigateDate, goToToday, searchQuery, setSearchQuery } = useCalendar();
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  const getDisplayDate = () => {
    if (currentView === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (currentView === 'week') {
      return format(currentDate, 'MMM yyyy');
    } else if (currentView === 'year') {
      return format(currentDate, 'yyyy');
    } else {
      return format(currentDate, 'MMMM d, yyyy');
    }
  };

  const getViewLabel = () => {
    switch (currentView) {
      case 'day': return 'Day';
      case 'week': return 'Week';
      case 'month': return 'Month';
      case 'year': return 'Year';
      case 'schedule': return 'Schedule';
      case '4days': return '4 days';
      default: return 'Month';
    }
  };

  const handleViewChange = (view) => {
    setView(view);
    setShowViewMenu(false);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        {/* Logo/Title */}
        <div className="flex items-center gap-3">
          {/* Google Calendar Style Logo */}
          <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main Calendar Body */}
            <rect x="6" y="10" width="36" height="32" rx="3" fill="#1a73e8"/>

            {/* Top Color Strips */}
            <rect x="6" y="10" width="12" height="4" rx="3" fill="#ea4335"/>
            <rect x="18" y="10" width="12" height="4" fill="#fbbc04"/>
            <rect x="30" y="10" width="12" height="4" rx="3" fill="#34a853"/>

            {/* Date Display Area */}
            <rect x="9" y="17" width="30" height="21" rx="1" fill="white"/>

            {/* Number "31" */}
            <text x="24" y="35" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fill="#1a73e8" textAnchor="middle">31</text>
          </svg>
          <h1 className="text-2xl font-normal text-gray-700">Calendar</h1>
        </div>

        {/* Today Button */}
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
        >
          Today
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigateDate(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Current Date Display */}
        <h2 className="text-xl font-normal text-gray-700">{getDisplayDate()}</h2>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          {showSearch ? (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onBlur={() => !searchQuery && setShowSearch(false)}
            />
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>

        {/* Settings */}
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* View Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowViewMenu(!showViewMenu)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
          >
            <span>{getViewLabel()}</span>
            <svg className={`w-4 h-4 transition-transform ${showViewMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showViewMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowViewMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                <button
                  onClick={() => handleViewChange('day')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Day</span>
                  <span className="text-xs text-gray-400">D</span>
                </button>
                <button
                  onClick={() => handleViewChange('week')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Week</span>
                  <span className="text-xs text-gray-400">W</span>
                </button>
                <button
                  onClick={() => handleViewChange('month')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Month</span>
                  <span className="text-xs text-gray-400">M</span>
                </button>
                <button
                  onClick={() => handleViewChange('year')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Year</span>
                  <span className="text-xs text-gray-400">Y</span>
                </button>
                <button
                  onClick={() => handleViewChange('schedule')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Schedule</span>
                  <span className="text-xs text-gray-400">A</span>
                </button>
                <button
                  onClick={() => handleViewChange('4days')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>4 days</span>
                  <span className="text-xs text-gray-400">X</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="relative group">
          <button className="w-10 h-10 rounded-full bg-blue-600 text-white font-medium flex items-center justify-center hover:bg-blue-700 transition-colors">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-50">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
