# Event Calendar Application

A modern, feature-rich calendar application built with React and shadcn/ui.

## Features

- **Calendar View**
  - Monthly calendar grid with proper day alignment
  - Previous/Next month navigation
  - Weekend/weekday visual distinction
  - Current day highlighting

- **Event Management**
  - Add events to any day
  - Edit existing events
  - Delete events
  - Event details include:
    - Title
    - Description (optional)
    - Start and end time
    - Color category (work, personal, other)

- **Event Display**
  - List view for daily events
  - Event color coding
  - Prevents overlapping events
  - Shows up to 3 events per day with "+more" indicator

- **Search & Export**
  - Search events by keyword
  - Export monthly events as JSON

- **Data Persistence**
  - Events are saved to localStorage
  - Persists between page refreshes

## Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the provided local URL

## Technologies Used

- React
- TypeScript
- shadcn/ui
- Tailwind CSS
- Lucide Icons

## Project Structure

- `/src/components` - React components
- `/src/lib` - Utility functions and helpers
- `/src/types` - TypeScript type definitions

## Code Quality

- TypeScript for type safety
- Modular component architecture
- Clean and maintainable code structure
- Comprehensive error handling
- Responsive design