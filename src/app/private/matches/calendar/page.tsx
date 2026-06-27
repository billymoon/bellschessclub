"use client";
import { AllegroEvent, Match } from "@/modules/schema";
import { YearCalendar } from "@/components/ui/year-calendar";
import { useDocuments } from "@/modules/dexie/useDocuments";

const year = new Date().getFullYear();
// Chess season runs June to May, so if we're before June, we start from previous year
const currentMonth = new Date().getMonth();
const startYear = currentMonth < 5 ? year - 1 : year; // 5 = June (0-indexed, so < 5 means before June)
const endYear = startYear + 1;

export default function Page() {
  const matchData = useDocuments(`(
    $members := $[_type = "member"];
    $getPlayer := function($id) {
      $members[_id = $id]
    };
    $[_type = 'match' or _type = 'allegro'] ~> |$|{
      "availability": $.players.availability ? $.players[].{
            "availability": availability,
            "rating": rating,
            "name": $getPlayer(player._ref).name
            }^(>rating) : null
    }|;
  )^(>date)[]`) as (Match | AllegroEvent)[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-foreground mt-8">
        {startYear}-{endYear} Chess Season
      </h2>
      <YearCalendar
        year={startYear}
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
                      : team === 0
                        ? "summercup"
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
