"use client";
import { Button } from "@/components/ui/button";
import { AllegroEvent, Match, Member } from "@/modules/schema";
import { useState } from "react";
import { MatchCard } from "@/components/MatchCard";
import { Calendar, History } from "lucide-react";
import Link from "next/link";
import { useDocuments } from "@/modules/dexie/useDocuments";
import { useDexieStore } from "@/modules/dexie/dexie-store-provider";

const EPOCH = new Date(0).toISOString();
const NOW = new Date().toISOString();

export default function Page() {
  const members = useDocuments(
    `$[_type = "member"]^(>standardPublished)`,
  ) as Member[];
  const cookieUserInfo = useDexieStore((state) => state.cookieUserInfo);
  const member = members.find(({ _id }) => _id === cookieUserInfo?._id);
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
  )^(<date)[]`) as (Match | AllegroEvent)[];


  const [showSince, setShowSince] = useState<string>(NOW);

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
      <div className="flex gap-4">
        <Button
          variant={showSince === EPOCH ? "outline" : "secondary"}
          className="grow mt-4 cursor-pointer"
          onClick={() => setShowSince(showSince === EPOCH ? NOW : EPOCH)}
        >
          <History />
          {showSince === EPOCH ? "Hide historic" : "Show historic"}
        </Button>
        <Button variant="secondary" className="mt-4 cursor-pointer" asChild>
          <Link href="/private/matches/calendar">
            <Calendar />
            Calendar
          </Link>
        </Button>
      </div>
      {matchData
        ?.filter(({ date }) => date > showSince)
        .map((match) => (
          <div key={`${match._id}:${match._rev}`}>
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
