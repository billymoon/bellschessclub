"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getAllegroEvents,
  setAvailabilityForMatch,
  getMatches,
} from "@/modules/turso";
import { AllegroEvent, Match, Member } from "@/modules/schema";
import { useMemberStore } from "@/stores/member-store-provider";
import { Check, Dices, X } from "lucide-react";
import { useEffect, useState } from "react";

const EPOCH = new Date(0).toISOString();
const NOW = new Date().toISOString();

const availabilityTypes = ["available", "maybe", "not available"];

const MatchCard = ({
  match,
  isNextOfType,
  member,
}: {
  match: Match;
  isNextOfType: boolean;
  member: Member;
}) => {
  const hasGivenAvailability = match?.players?.find(
    (item) => item.player?._ref === member._id,
  );
  const [shouldGiveAvailability, setShouldGiveAvailability] =
    useState(!hasGivenAvailability);
  return (
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
      <div>
        We cordially invite you as a member of <b>Team {match.team}</b> on{" "}
        <b>
          <DateTime timestamp={match.date} />
        </b>{" "}
        to take part in the annihilation of {match.opponent} at{" "}
        <b>{match.isAtHome ? "at our home venue" : "away at their venue"}</b> of{" "}
        {match.venue}
      </div>
      {match?.availability && (
        <div>
          {match?.availability
            ?.sort(
              (a, b) =>
                availabilityTypes.findIndex((x) => x === a.availability) -
                  availabilityTypes.findIndex((x) => x === b.availability) ||
                (b.rating || 0) - (a.rating || 0),
            )
            .map(({ availability, name }, index) => (
              <div key={index}>
                <Badge
                  className={
                    ["bg-green-700", "bg-orange-200", "bg-red-200"][
                      availabilityTypes.findIndex((x) => x === availability)
                    ]
                  }
                >
                  {availability}
                </Badge>{" "}
                {name}
              </div>
            ))}
        </div>
      )}
      {isNextOfType && !shouldGiveAvailability ? (
        <div>
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setShouldGiveAvailability(true)}
          >
            Change availability
          </Button>
        </div>
      ) : null}
      {isNextOfType && shouldGiveAvailability ? (
        <div>
          <div className="font-medium mb-2">Can you make it to this match?</div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="default"
              className="cursor-pointer bg-green-700 hover:bg-green-600"
              onClick={async () => {
                await setAvailabilityForMatch(match._id!, "available");
                window.location.replace(window.location.href);
              }}
            >
              <Check /> Yes! I am available
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer bg-orange-200 hover:bg-orange-300"
              onClick={async () => {
                await setAvailabilityForMatch(match._id!, "maybe");
                window.location.replace(window.location.href);
              }}
            >
              <Dices /> Maybe
            </Button>
            <Button
              variant="secondary"
              className="cursor-pointer bg-red-200 hover:bg-red-300"
              onClick={async () => {
                await setAvailabilityForMatch(match._id!, "not available");
                window.location.replace(window.location.href);
              }}
            >
              <X /> Not Available
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

const AllegroCard = ({
  match,
  isNextOfType,
}: {
  match: AllegroEvent;
  isNextOfType: boolean;
}) => (
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
    {isNextOfType ? <div>asdasd</div> : null}
  </Card>
);

const DateTime = ({ timestamp }: { timestamp: string }) => (
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
            {match._type === "allegro" ? (
              <AllegroCard
                match={match}
                isNextOfType={nextMatchIds.includes(match._id)}
              />
            ) : (
              <MatchCard
                match={match}
                isNextOfType={nextMatchIds.includes(match._id)}
                member={member}
              />
            )}
          </div>
        ))}
    </div>
  );
}
