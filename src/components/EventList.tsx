import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { sortEvents } from '@/lib/calendar';

interface EventListProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function EventList({
  isOpen,
  onClose,
  selectedDate,
  events,
  onEditEvent,
  onDeleteEvent,
}: EventListProps) {
  const sortedEvents = sortEvents(events);

  const getEventColor = (color: string) => {
    switch (color) {
      case 'work':
        return 'bg-blue-100 text-blue-800';
      case 'personal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Events</SheetTitle>
          <SheetDescription>
            {new Date(selectedDate).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {sortedEvents.length === 0 ? (
            <p className="text-muted-foreground">No events for this day</p>
          ) : (
            sortedEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditEvent(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {event.startTime} - {event.endTime}
                  </Badge>
                  <Badge className={getEventColor(event.color || 'other')}>
                    {event.color}
                  </Badge>
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}