"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMatches } from "@/modules/sanity";
import { Match } from "@/modules/schema";
import { useMemberStore } from "@/stores/member-store-provider";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

// const DateTime = ({ timestamp, ...props }) => (
//   <div {...props}>
//     {timestamp} <input type="date" defaultValue={timestamp.slice(0, 10)} />{" "}
//     <input type="time" value={timestamp.slice(11, 16)} />{" "}
//     <input type="datetime-local" value={timestamp.slice(0, 16)} />
//   </div>
// );
const DateTime = ({ timestamp }) => (
  <>
    {new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "Europe/London",
    }).format(new Date(timestamp))}
  </>
);

export default function Page() {
  const { member } = useMemberStore((state) => state);
  const [matchData, setMatchData] = useState<Match[] | null>(null);

  useEffect(() => {
    void (async () => {
      setMatchData(await getMatches());
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {matchData?.map((match) => (
        <Card className="p-8 my-4 relative" key={match._id}>
          {/* {match.day} */}
          {member.isAdmin ? (
            <div className="absolute right-1 top-1">
              <Button asChild variant="ghost" size="sm">
                <a href={`/members/matches/${match._id}`}>
                  <Pencil className="size-3" /> Edit
                </a>
              </Button>
            </div>
          ) : null}
          <div>
            We cordially invite you as a member of <b>Team {match.team}</b> on{" "}
            <b>
              <DateTime timestamp={match.date} />
            </b>{" "}
            to take part in the annihilation of {match.opponent} at{" "}
            <b>
              {match.isAtHome ? "at our home venue" : "away at their venue"}
            </b>{" "}
            of {match.venue}
          </div>
        </Card>
      ))}
    </div>
  );
}
