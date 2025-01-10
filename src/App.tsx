import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EventDialog } from '@/components/EventDialog';
import { EventList } from '@/components/EventList';
import { Event, CalendarDay } from '@/types';
import {
  addEvent,
  deleteEvent,
  loadEvents,
  updateEvent,
  searchEvents,
} from '@/lib/storage';
import { getCalendarDays, formatDate } from '@/lib/calendar';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const days = getCalendarDays(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const allEvents = loadEvents();
    
    days.forEach((day) => {
      day.events = allEvents.filter(
        (event) => event.date === formatDate(day.date)
      );
    });

    setCalendarDays(days);
    setEvents(allEvents);
  }, [currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (date: string) => {
    // Reset selected event and set new date before opening dialog
    setSelectedEvent(undefined);
    setSelectedDate(date);
    setShowEventDialog(true);
  };

  const handleSaveEvent = (event: Event) => {
    if (selectedEvent) {
      updateEvent(event);
    } else {
      addEvent(event);
    }
    
    const updatedEvents = loadEvents();
    setEvents(updatedEvents);
    
    const days = getCalendarDays(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    days.forEach((day) => {
      day.events = updatedEvents.filter(
        (event) => event.date === formatDate(day.date)
      );
    });
    setCalendarDays(days);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    const updatedEvents = loadEvents();
    setEvents(updatedEvents);
    
    const days = getCalendarDays(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    days.forEach((day) => {
      day.events = updatedEvents.filter(
        (event) => event.date === formatDate(day.date)
      );
    });
    setCalendarDays(days);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const searchResults = searchEvents(query);
      const days = getCalendarDays(
        currentDate.getFullYear(),
        currentDate.getMonth()
      );
      days.forEach((day) => {
        day.events = searchResults.filter(
          (event) => event.date === formatDate(day.date)
        );
      });
      setCalendarDays(days);
    } else {
      const allEvents = loadEvents();
      const days = getCalendarDays(
        currentDate.getFullYear(),
        currentDate.getMonth()
      );
      days.forEach((day) => {
        day.events = allEvents.filter(
          (event) => event.date === formatDate(day.date)
        );
      });
      setCalendarDays(days);
    }
  };

  const handleExport = () => {
    const eventsToExport = events.filter((event) =>
      new Date(event.date).getMonth() === currentDate.getMonth()
    );
    const dataStr = JSON.stringify(eventsToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `calendar-events-${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDragStart = (e: React.DragEvent, event: Event) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(event));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: string) => {
    e.preventDefault();
    const droppedEvent = JSON.parse(e.dataTransfer.getData('text/plain')) as Event;
    
    if (droppedEvent.date !== date) {
      const updatedEvent = { ...droppedEvent, date };
      updateEvent(updatedEvent);
      
      const updatedEvents = loadEvents();
      setEvents(updatedEvents);
      
      const days = getCalendarDays(
        currentDate.getFullYear(),
        currentDate.getMonth()
      );
      days.forEach((day) => {
        day.events = updatedEvents.filter(
          (event) => event.date === formatDate(day.date)
        );
      });
      setCalendarDays(days);
    }
  };

  const getEventColor = (color?: string) => {
    switch (color) {
      case 'work':
        return 'bg-blue-500';
      case 'personal':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Calendar</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Month
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between bg-card p-4 rounded-lg shadow-sm">
          <Button variant="outline" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <Button variant="outline" onClick={handleNextMonth}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-muted text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-background py-2 font-semibold">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-muted">
          {calendarDays.map((day, idx) => {
            const formattedDate = formatDate(day.date);
            return (
              <div
                key={idx}
                className={`min-h-[120px] bg-background p-2 ${
                  !day.isCurrentMonth && 'text-muted-foreground'
                } ${day.isToday && 'ring-2 ring-primary'}`}
                onClick={() => handleDayClick(formattedDate)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, formattedDate)}
              >
                <div className="mb-2 font-medium">{day.date.getDate()}</div>
                <div className="space-y-1">
                  {day.events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`${getEventColor(
                        event.color
                      )} text-white text-xs p-1 rounded truncate cursor-move`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(formattedDate);
                        setSelectedEvent(event);
                        setShowEventDialog(true);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div
                      className="text-xs text-muted-foreground cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(formattedDate);
                        setShowEventList(true);
                      }}
                    >
                      +{day.events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <EventDialog
          isOpen={showEventDialog}
          onClose={() => {
            setShowEventDialog(false);
            setSelectedEvent(undefined);
          }}
          onSave={handleSaveEvent}
          selectedDate={selectedDate}
          event={selectedEvent}
        />

        <EventList
          isOpen={showEventList}
          onClose={() => setShowEventList(false)}
          selectedDate={selectedDate}
          events={calendarDays
            .find((day) => formatDate(day.date) === selectedDate)
            ?.events || []}
          onEditEvent={(event) => {
            setSelectedEvent(event);
            setShowEventList(false);
            setShowEventDialog(true);
          }}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
    </div>
  );
}