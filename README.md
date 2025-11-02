📅 Google Calendar Clone

A high-fidelity fullstack clone of Google Calendar built with a focus on interactivity, smooth animations, and realistic logic flow.
This project replicates the core functionalities of Google Calendar, including event creation, modification, and viewing — all backed by a simple API and persistent data layer.

⚙️ Setup and Run Instructions
🖥️ Prerequisites

Node.js (v16 or higher)

npm or yarn

Git

🧩 Steps to Run Locally
1. Clone the repository
git clone https://github.com/Dilkhush29/google-calendar-clone.git

2. Navigate to the project folder
cd google-calendar-clone/client

3. Install dependencies
npm install

4. Start the development server
npm run dev


Then open the link shown in your terminal (usually http://localhost:5173/).

🏗️ Architecture and Technology Choices
Frontend

React (Vite) – for fast, component-based UI development

Tailwind CSS – for modern, responsive, and utility-first styling

Context API – for managing global state (events, calendar view, authentication)

React Router (optional) – for navigating between views (Month, Week, Day)

Framer Motion – for smooth transitions and animations

Backend

(if implemented)

Node.js + Express.js – to handle API endpoints for events

MongoDB / SQLite – for persisting user events and settings

🧠 Business Logic and Edge Cases
✅ Core Features:

Create, update, and delete events directly from the calendar UI

Switch between Month, Week, and Day views

View detailed event info in modals

Smooth drag-and-drop interaction for changing event time slots

⚠️ Edge Cases Handled:

Recurring events (basic pattern-based repetition)

Event overlaps – overlapping events are displayed side-by-side without collision

Invalid inputs – checks for empty titles or invalid time ranges

Time zone consistency – ensures event time renders correctly across views

🎨 Animations and Interactions

Framer Motion powers transitions between views (Month → Week → Day).

Modal popups and side panels use fade and scale animations for natural interaction.

Subtle hover and click effects mimic the real Google Calendar UX.

Calendar grid uses CSS transitions for resizing and smooth drag interactions.

🚀 Future Enhancements

🔐 User authentication (Google OAuth or custom login)

🔄 Real-time sync using WebSockets

📱 Mobile app version using React Native

📆 Integration with Google Calendar API for live data import/export

🕒 Advanced recurrence rules (custom intervals, exceptions)

🧑‍💻 Author

Dilkhush Bishnoi
B.Tech CSE (AI/ML) — Bennett University