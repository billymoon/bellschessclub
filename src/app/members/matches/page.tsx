// @ts-nocheck
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAllegroEvents, getMatches } from "@/modules/sanity";
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

const EPOCH = new Date(0).toISOString();
const NOW = new Date().toISOString();

const MatchCard = ({ match, member }) => (
  <Card
    className={cn(
      "p-8 my-4 relative",
      match.date < NOW
        ? "bg-gray-200"
        : match.team === 1
          ? "bg-blue-100"
          : "bg-green-100",
    )}
    key={match._id}
  >
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
      <b>{match.isAtHome ? "at our home venue" : "away at their venue"}</b> of{" "}
      {match.venue}
    </div>
  </Card>
);

const AllegroCard = ({ match }) => (
  <Card
    className={cn(
      "p-8 my-4 relative",
      match.date < NOW ? "bg-gray-200" : "bg-orange-100",
    )}
    key={match._id}
  >
    <div>
      It&apos;s that time again, Allegro will be hosted at Slateford Bowling
      Club on{" "}
      <b>
        <DateTime timestamp={match.date} />
      </b>{" "}
      where we will be up against {match.opponents.join(" and ")}.
    </div>
  </Card>
);

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
  const [showSince, setShowSince] = useState<string>(NOW);

  useEffect(() => {
    void (async () => {
      const matches = await getMatches();
      const allegroEvents = await getAllegroEvents();
      setMatchData(
        [...matches, ...allegroEvents].sort((a, b) =>
          a.date < b.date ? -1 : 1,
        ),
      );
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Button
        variant={showSince === EPOCH ? "default" : "secondary"}
        className="w-full mt-4 cursor-pointer"
        onClick={() => setShowSince(showSince === EPOCH ? NOW : EPOCH)}
      >
        {showSince === EPOCH ? "Hide historic" : "Show historic"}
      </Button>
      {matchData
        ?.filter(({ date }) => date > showSince)
        .map((match) => (
          <div key={match._id}>
            {match._type === "allegro" ? (
              <AllegroCard member={member} match={match} />
            ) : (
              <MatchCard member={member} match={match} />
            )}
          </div>
        ))}
    </div>
  );
}
