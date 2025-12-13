"use client";
import { Button } from "@/components/ui/button";
import { getAllegroEvents, getMatches } from "@/modules/turso";
import { AllegroEvent, Match } from "@/modules/schema";
import { useMemberStore } from "@/stores/member-store-provider";
import { useEffect, useState } from "react";
import { MatchCard } from "@/components/MatchCard";

const EPOCH = new Date(0).toISOString();
const NOW = new Date().toISOString();

export default function Page() {
  const { member } = useMemberStore((state) => state);
  const [matchData, setMatchData] = useState<(Match | AllegroEvent)[] | null>(
    null,
  );
  const [showSince, setShowSince] = useState<string>(NOW);

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

  const nextTeam1Match = matchData?.find(
    (match) => match.date >= NOW && match._type === "match" && match.team === 1,
  );
  const nextTeam2Match = matchData?.find(
    (match) => match.date >= NOW && match._type === "match" && match.team === 2,
  );
  const nextAllegroMatch = matchData?.find(
    (match) => match.date >= NOW && match._type === "allegro",
  );

  const nextMatchIds = [
    nextTeam1Match?._id,
    nextTeam2Match?._id,
    nextAllegroMatch?._id,
  ];

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
            <MatchCard
              match={match}
              member={member}
              isNextOfType={nextMatchIds.includes(match._id)}
            />
          </div>
        ))}
    </div>
  );
}
