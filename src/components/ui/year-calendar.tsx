"use client";

interface Event {
  date: number;
  month: number;
  year: number;
  type: "allegro" | "team1" | "team2"; // | "social";
  title: string;
}

interface YearCalendarProps {
  year?: number;
  events?: Event[];
}

const eventTypeColors: Record<string, { bg: string; text: string }> = {
  allegro: { bg: "card-allegro", text: "text-primary-foreground" },
  team1: { bg: "card-team-1", text: "text-accent-foreground" },
  team2: { bg: "card-team-2", text: "text-accent-foreground" },
  //   social: { bg: "card-social", text: "text-social-foreground" },
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

  // Chess season runs June to May, so if we're before June, we start from previous year
  const currentMonth = new Date().getMonth();
  const startYear = currentMonth < 5 ? year - 1 : year; // 5 = June (0-indexed, so < 5 means before June)
  const endYear = startYear + 1;

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
                  className={`aspect-square border border-border/20 p-1 flex flex-col items-center justify-start bg-background hover:bg-muted/20 transition-colors ${firstDayEvent ? eventTypeColors[firstDayEvent.type].bg : ""} rounded-full border-2`}
                >
                  <span className="text-xs font-bold text-foreground/70 m-auto">
                    {day}
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
          renderMonth(monthIndex, startYear),
        )}
        {/* January to May of end year */}
        {Array.from({ length: 5 }, (_, i) => i).map((monthIndex) =>
          renderMonth(monthIndex, endYear),
        )}
      </div>
    </div>
  );
}
