"use client";
import { getAllegroEvents, getMatches } from "@/modules/turso";
import { AllegroEvent, Match } from "@/modules/schema";
import { useEffect, useState } from "react";
import { YearCalendar } from "@/components/ui/year-calendar";

const year = 2025;

export default function Page() {
  const [matchData, setMatchData] = useState<(Match | AllegroEvent)[] | null>(
    null,
  );

  useEffect(() => {
    void (async () => {
      if (typeof window !== "undefined") {
        const matches = await getMatches();
        const allegroEvents = await getAllegroEvents();
        setMatchData(
          [...matches, ...allegroEvents].sort((a, b) =>
            a.date < b.date ? -1 : 1,
          ),
        );
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-foreground mt-8">
        {year}-{year + 1} Chess Season
      </h2>
      <YearCalendar
        year={year}
        events={
          !matchData
            ? []
            : matchData.map(
                ({
                  date,
                  _type,
                  team,
                  isAtHome,
                }: {
                  date: string;
                  _type: string;
                  team?: number;
                  isAtHome?: boolean;
                }) => ({
                  date: new Date(date).getDate(),
                  month: new Date(date).getMonth(),
                  year: new Date(date).getFullYear(),
                  type:
                    _type === "allegro"
                      ? "allegro"
                      : team === 1
                        ? "team1"
                        : "team2",
                  title: "sweet",
                  isAtHome: Boolean(isAtHome),
                }),
              )
        }
      />
    </div>
  );
}
