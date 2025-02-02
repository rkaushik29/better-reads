import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon, CheckCircle2, Circle, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineEvent {
  title: string;
  startDate: string;
  endDate?: string;
  status: "wantToRead" | "read" | "reading";
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const sortedEvents = events.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <div className="space-y-8">
      {sortedEvents.map((event, index) => (
        <TimelineItem key={index} event={event} />
      ))}
    </div>
  );
}

function TimelineItem({ event }: { event: TimelineEvent }) {
  const startDate = parseISO(event.startDate);
  const endDate = event.endDate ? parseISO(event.endDate) : null;

  const getStatusIcon = (status: TimelineEvent["status"]) => {
    switch (status) {
      case "read":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "reading":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "wantToRead":
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TimelineEvent["status"]) => {
    switch (status) {
      case "read":
        return "bg-green-100 text-green-800";
      case "reading":
        return "bg-blue-100 text-blue-800";
      case "wantToRead":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{event.title}</span>
          <Badge className={cn("capitalize", getStatusColor(event.status))}>
            {event.status.replace("-", " ")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {isValid(startDate) && format(startDate, "MMM d, yyyy")}
            {endDate && isValid(endDate)
              ? ` - ${format(endDate, "MMM d, yyyy")}`
              : " - Ongoing"}
          </span>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          {getStatusIcon(event.status)}
          <span className="text-sm font-medium">
            {event.status === "read"
              ? "Read"
              : event.status === "reading"
                ? "Reading"
                : "Want to Read"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
