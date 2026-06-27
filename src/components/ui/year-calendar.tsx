"use client";

import { Circle, Icon } from "lucide-react";

interface Event {
  date: number;
  month: number;
  year: number;
  type: "allegro" | "team1" | "team2"; // | "social";
  title: string;
  isAtHome: boolean;
}

interface YearCalendarProps {
  year?: number;
  events?: Event[];
}

const eventTypeColors: Record<
  string,
  { bg: string; fill: string; text: string }
> = {
  allegro: {
    bg: "card-allegro",
    fill: "fill-allegro",
    text: "text-primary-foreground",
  },
  summercup: {
    bg: "card-summercup",
    fill: "fill-summercup",
    text: "text-accent-foreground",
  },
  team1: {
    bg: "card-team-1",
    fill: "fill-team-1",
    text: "text-accent-foreground",
  },
  team2: {
    bg: "card-team-2",
    fill: "fill-team-2",
    text: "text-accent-foreground",
  },
  //   social: { bg: "card-social", fill: "fill-social", text: "text-social-foreground" },
};

export function YearCalendar({
  year = new Date().getFullYear(),
  events = [],
}: YearCalendarProps) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (monthIndex: number, yearValue: number) => {
    return new Date(yearValue, monthIndex + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (monthIndex: number, yearValue: number) => {
    const dayOfWeek = new Date(yearValue, monthIndex, 1).getDay();
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  };

  const getEventsForDate = (
    day: number,
    monthIndex: number,
    yearValue: number,
  ) => {
    return events.filter(
      (event) =>
        event.date === day &&
        event.month === monthIndex &&
        event.year === yearValue,
    );
  };

  const renderMonth = (monthIndex: number, yearValue: number) => {
    const daysInMonth = getDaysInMonth(monthIndex, yearValue);
    const firstDay = getFirstDayOfMonth(monthIndex, yearValue);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div key={`${monthIndex}-${yearValue}`} className="space-y-3">
        <div className="relative -top-14" id={`${monthIndex}-${yearValue}`}></div>
        <h3 className="text-lg font-semibold text-foreground text-center">
          {months[monthIndex]} {yearValue}
        </h3>
        <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0 bg-muted/30">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0">
            {emptyDays.map((i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square bg-muted/10 border border-border/20"
              />
            ))}
            {days.map((day) => {
              const dayEvents = getEventsForDate(day, monthIndex, yearValue);
              const firstDayEvent = dayEvents[0];
              return (
                <div
                  key={day}
                  className="aspect-square border border-border/20 p-1 flex flex-col items-center justify-start bg-background hover:bg-muted/20 transition-colors"
                >
                  <span className="text-xs font-bold text-foreground/70 m-auto">
                    <div className="flex relative justify-center">
                      <div className="absolute">
                        {!firstDayEvent ? null : firstDayEvent.isAtHome ? (
                          <Icon
                            className={`w-8 h-8 ${firstDayEvent ? eventTypeColors[firstDayEvent.type].fill : ""} relative bottom-2.5`}
                            iconNode={[
                              [
                                "path",
                                {
                                  d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
                                  key: firstDayEvent.date.toString(),
                                },
                              ],
                            ]}
                          />
                        ) : (
                          <Circle
                            className={`w-8 h-8 ${firstDayEvent ? eventTypeColors[firstDayEvent.type].fill : ""} relative bottom-2`}
                          />
                        )}
                      </div>
                      <div className="w-full h-full m-auto z-1">{day}</div>
                    </div>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full my-8">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-3">
          {Object.entries(eventTypeColors).map(([type, colors]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${colors.bg}`} />
              <span className="text-sm text-foreground capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* June to December of start year */}
        {Array.from({ length: 7 }, (_, i) => i + 5).map((monthIndex) =>
          renderMonth(monthIndex, year),
        )}
        {/* January to May of end year */}
        {Array.from({ length: 5 }, (_, i) => i).map((monthIndex) =>
          renderMonth(monthIndex, year + 1),
        )}
      </div>
    </div>
  );
}
