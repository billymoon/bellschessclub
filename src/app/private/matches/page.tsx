"use client";
import { Button } from "@/components/ui/button";
import {
  AllegroEventDocument,
  MatchDocument,
} from "@/modules/data/document-schema";
import { useEffect, useState } from "react";
import { MatchCard } from "@/components/MatchCard";
import { Calendar, History, PlusSquare } from "lucide-react";
import Link from "next/link";
import { useDocuments } from "@/modules/data/dexie/useDocuments";
import { useDexieStore } from "@/modules/data/dexie/dexie-store-provider";
import { MemberDocument } from "@/modules/data/member-schema";

const EPOCH = new Date(0).toISOString();
const NOW = new Date().toISOString();

export default function Page() {
  const members = useDocuments(
    `$[_type = "member"]^(>standardPublished)`,
  ) as MemberDocument[];
  const cookieUserInfo = useDexieStore((state) => state.cookieUserInfo);
  const member = members.find(({ _id }) => _id === cookieUserInfo?._id)!;
  const matchData = useDocuments(`(
    $members := $[_type = "member"];
    $getPlayer := function($id) {
      $members[_id = $id]
    };
    $[_type = 'match' or _type = 'allegro'] ~> |$|{
      "availability": $.players.availability ? $.players[].{
        "availability": availability,
        "rating": %._type = 'allegro' ? $getPlayer(player._ref).allegroPublished :  $getPlayer(player._ref).standardPublished,
        "name": $getPlayer(player._ref).name,
        "pnum": $getPlayer(player._ref).pnum
        }^(>rating) : null
    }|;
  )^(<date)[]`) as (MatchDocument | AllegroEventDocument)[];

  const [showSince, setShowSince] = useState<string>(NOW);
  const [showHeight, setShowHeight] = useState<number>(0);

  useEffect(() => {
    if (showSince === EPOCH) {
      const afterHeight = window.document.body.getBoundingClientRect().height;
      window.scrollTo(0, afterHeight - showHeight);
    }
  }, [showSince]);

  const nextSummercupMatch = matchData?.find(
    (match) => match.date >= NOW && match._type === "match" && match.team === 0,
  );
  const nextTeam1Match = matchData?.find(
    (match) => match.date >= NOW && match._type === "match" && match.team === 1,
  );
  const nextTeam2Match = matchData?.find(
    (match) => match.date >= NOW && match._type === "match" && match.team === 2,
  );
  const nextTeam3Match = matchData?.find(
    (match) => match.date >= NOW && match._type === "match" && match.team === 3,
  );
  const nextAllegroMatch = matchData?.find(
    (match) => match.date >= NOW && match._type === "allegro",
  );

  const nextMatchIds = [
    nextSummercupMatch?._id,
    nextTeam1Match?._id,
    nextTeam2Match?._id,
    nextTeam3Match?._id,
    nextAllegroMatch?._id,
  ];

  const now = new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex gap-4">
        <Button
          variant={showSince === EPOCH ? "outline" : "secondary"}
          className="grow mt-4 cursor-pointer"
          onClick={() => {
            setShowHeight(window.document.body.getBoundingClientRect().height);
            setShowSince(showSince === EPOCH ? NOW : EPOCH);
          }}
        >
          <History />
          {showSince === EPOCH ? "Hide historic" : "Show historic"}
        </Button>
        {member.isAdmin && (
          <Button variant="secondary" className="mt-4 cursor-pointer" asChild>
            <Link prefetch href={`/admin/matches/add`}>
              <PlusSquare />
              Add match
            </Link>
          </Button>
        )}
        <Button variant="secondary" className="mt-4 cursor-pointer" asChild>
          <Link
            prefetch
            href={`/private/matches/calendar#${now.getMonth()}-${now.getFullYear()}`}
          >
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
