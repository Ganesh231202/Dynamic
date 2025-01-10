import { Event } from '@/types';

const STORAGE_KEY = 'calendar_events';

export function saveEvents(events: Event[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function loadEvents(): Event[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addEvent(event: Event): void {
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
}

export function updateEvent(updatedEvent: Event): void {
  const events = loadEvents();
  const index = events.findIndex((e) => e.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    saveEvents(events);
  }
}

export function deleteEvent(eventId: string): void {
  const events = loadEvents();
  const filteredEvents = events.filter((e) => e.id !== eventId);
  saveEvents(filteredEvents);
}

export function getEventsForDate(date: string): Event[] {
  const events = loadEvents();
  return events.filter((e) => e.date === date);
}

export function searchEvents(query: string): Event[] {
  const events = loadEvents();
  const lowercaseQuery = query.toLowerCase();
  return events.filter(
    (e) =>
      e.title.toLowerCase().includes(lowercaseQuery) ||
      (e.description?.toLowerCase().includes(lowercaseQuery))
  );
}