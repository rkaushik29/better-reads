import React, { useState } from "react";
import {
  format,
  parseISO,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimelineEvent {
  id: string;
  title: string;
  startDate: string | null;
  endDate?: string | null;
  status: "wanToRead" | "read" | "reading";
  rating: number | null;
}

interface CalendarTimelineProps {
  events: TimelineEvent[];
}

const colors = [
  "bg-red-200 border-red-400",
  "bg-blue-200 border-blue-400",
  "bg-green-200 border-green-400",
  "bg-yellow-200 border-yellow-400",
  "bg-purple-200 border-purple-400",
  "bg-pink-200 border-pink-400",
  "bg-indigo-200 border-indigo-400",
  "bg-teal-200 border-teal-400",
];

export function CalendarTimeline({ events }: CalendarTimelineProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => {
    setCurrentDate(
      (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      (date) => new Date(date.getFullYear(), date.getMonth() + 1, 1),
    );
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const startDate = event.startDate ? parseISO(event.startDate) : new Date(0);
      const endDate = event.endDate ? parseISO(event.endDate) : new Date(2099, 11, 31);
      return date >= startDate && date <= endDate;
    });
  };
  const getEventStyle = (event: TimelineEvent, date: Date, index: number) => {
    const startDate = event.startDate ? parseISO(event.startDate) : new Date(0);
    const endDate = event.endDate ? parseISO(event.endDate) : new Date(2099, 11, 31);
    const isStart = isSameDay(date, startDate);
    const isEnd = isSameDay(date, endDate);
    const colorIndex =
      events.findIndex((e) => e.id === event.id) % colors.length;
    const color = colors[colorIndex];

    return cn(
      "h-5 border-t border-b",
      color,
      isStart && "rounded-l-full border-l pl-2",
      isEnd && "rounded-r-full border-r pr-2",
      !isStart && !isEnd && "border-l-0 border-r-0",
      `z-${10 + index}`,
    );
  };

  const toggleExpand = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setExpandedDates((prev) => {
      const newExpandedDates = new Set(prev);
      if (newExpandedDates.has(dateString)) {
        newExpandedDates.delete(dateString);
      } else {
        newExpandedDates.add(dateString);
      }
      return newExpandedDates;
    });
  };

  return (
    <TooltipProvider>
      <div className="w-full  bg-white p-3 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}
          {daysInMonth.map((date, index) => {
            const eventsForDate = getEventsForDate(date);
            const showExpandButton = eventsForDate.length > 3;
            return (
              <div
                key={date.toString()}
                className={cn(
                  "min-h-24 border rounded-lg p-1 overflow-hidden ",
                  !isSameMonth(date, currentDate) && "bg-gray-100",
                  isToday(date) && "border-blue-500",
                )}
                style={{
                  gridColumnStart: index === 0 ? date.getDay() + 1 : "auto",
                }}
              >
                <div className="text-right text-sm mb-1">
                  {format(date, "d")}
                </div>
                <div className="space-y-1">
                  {eventsForDate.slice(0, expandedDates.has(date.toISOString().split('T')[0]) ? eventsForDate.length : 3).map((event, eventIndex) => (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div className={getEventStyle(event, date, eventIndex)}>
                          <span className="truncate text-xs">
                            {event.title}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{event.title}</p>
                        <p>
                          Start:{" "}
                          {event.startDate ? format(parseISO(event.startDate), "MMM d, yyyy") : "N/A"}
                        </p>
                        {event.endDate && (
                          <p>
                            End:{" "}
                            {event.endDate ? format(parseISO(event.endDate), "MMM d, yyyy") : "N/A"}
                          </p>
                        )}
                        <p>Rating: {event.rating}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {showExpandButton && (
                    <Button
                     size='sm'
                     variant='ghost'                      
                     onClick={() => toggleExpand(date)}
                    >
                      {expandedDates.has(date.toISOString().split('T')[0]) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
