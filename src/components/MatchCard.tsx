import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  setAvailabilityForAllegroEvent,
  setAvailabilityForMatch,
} from "@/modules/turso";
import {
  Swords,
  CalendarPlus,
  Check,
  Dices,
  Map,
  X,
  MapPinHouse,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { AllegroEvent, Match, Member } from "@/modules/schema";
import { useState } from "react";
import Link from "next/link";

// const EPOCH = new Date(0).toISOString();
const NOW = new Date().toISOString();

const availabilityTypes = ["available", "maybe", "not available"];

const addToGoogleCalendar = (event: {
  name: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  location: string;
}) => {
  const { name, description, start_datetime, end_datetime, location } = event;

  const formatDate = (dateString: string) =>
    new Date(dateString).toISOString().replace(/-|:|\.\d\d\d/g, "");

  const dates = `${formatDate(start_datetime)}/${formatDate(end_datetime)}`;

  const url =
    `https://www.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(name)}` +
    `&dates=${dates}` +
    `&details=${encodeURIComponent(description)}` +
    `&location=${encodeURIComponent(location)}`;

  window.open(url, "_blank");
};

const DateTime = ({ timestamp }: { timestamp: string }) => (
  <>
    {new Intl.DateTimeFormat("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      year: "numeric",
      timeZone: "Europe/London",
    }).format(new Date(timestamp))}
  </>
);

export const MatchCard = ({
  match,
  isNextOfType,
  member,
}: {
  match: Match | AllegroEvent;
  isNextOfType: boolean;
  member: Member;
}) => {
  const setAvailability =
    match._type === "allegro"
      ? setAvailabilityForAllegroEvent
      : setAvailabilityForMatch;
  const hasGivenAvailability = match?.players?.find(
    (item) => item.player?._ref === member._id,
  );
  const [shouldGiveAvailability, setShouldGiveAvailability] =
    useState(!hasGivenAvailability);

  const mapLink =
    match._type === "allegro"
      ? "https://maps.app.goo.gl/ZYp7RMbbtJBEVmVp7"
      : match.mapLink ||
        (match.isAtHome
          ? new Date(match.date) > new Date("2026")
            ? "https://maps.app.goo.gl/hEGp6269cyveNRqH8"
            : "https://maps.app.goo.gl/oFVCSACCXoMneCid9"
          : undefined);

  const venue =
    match._type === "allegro" ? "Slateford Bowling Club" : match.venue;

  // @ts-ignore-line
  const opponent = (match.opponent || match.opponents.join(" and ")) as string;

  return (
    <Card className={cn("p-0 my-4 relative overflow-clip")} key={match._id}>
      <CardHeader
        className={`${match.date < NOW ? "card-historic" : match._type === "allegro" ? "card-allegro" : match._type === "match" && match.team === 1 ? "card-team-1" : "card-team-2"} gap-0 py-3`}
      >
        <div className="flex flex-col md:flex-row md:gap-8 justify-between w-full text-lg">
          <div className="font-bold">
            {match._type === "allegro"
              ? "Sandy Bells Allegro Team"
              : `Sandy Bells Team #${match.team.toString()}`}
          </div>
          <div className="relative">
            <div className="absolute right-0 bottom-0 md:bottom-auto md:right-auto">
              <Swords className="text-muted-foreground" />
            </div>
          </div>
          <div className="md:text-right">{opponent}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pb-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <Button
              variant="secondary"
              size="lg"
              className="text-lg gap-2 w-full md:w-auto"
              asChild
            >
              <Link
                href=""
                target="_blank"
                onClick={() => {
                  addToGoogleCalendar({
                    name:
                      match._type == "allegro"
                        ? "Sandy Bells Allegro Team Match"
                        : `Sandy Bells Team #${match.team.toString()}`,
                    description:
                      match._type === "allegro"
                        ? `Sandy Bells Allegro Team of four players to play against ${opponent} at Slateford Bowling Club`
                        : "Sandy Bells edinburgh league match",
                    start_datetime: match.date,
                    end_datetime: ((date) => {
                      date.setTime(date.getTime() + 1000 * 60 * 60 * 2.5);
                      return date.toISOString();
                    })(new Date(match.date)),
                    location: venue,
                  });
                }}
              >
                <CalendarPlus className="h-5 w-5" />
                <DateTime timestamp={match.date} />
              </Link>
            </Button>
            {mapLink ? (
              <Button
                variant="secondary"
                size="lg"
                className="text-lg gap-2 w-full md:w-auto"
                asChild
              >
                <Link href={mapLink} target="_blank">
                  {/* @ts-ignore-line */}
                  {match.isAtHome ? (
                    <MapPinHouse className="h-5 w-5" />
                  ) : (
                    <Map className="h-5 w-5" />
                  )}
                  {venue}
                </Link>
              </Button>
            ) : (
              <div className="h-10 flex gap-2 place-items-center">
                <MapPin className="h-5 w-5" />
                <div>{venue}</div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-6">
            {match?.availability && (
              <div>
                {match?.availability
                  ?.sort(
                    (a, b) =>
                      availabilityTypes.findIndex((x) => x === a.availability) -
                        availabilityTypes.findIndex(
                          (x) => x === b.availability,
                        ) || (b.rating || 0) - (a.rating || 0),
                  )
                  .map(({ availability, name }, index) => (
                    <div key={index}>
                      <Badge
                        className={
                          ["bg-green-700", "bg-orange-200", "bg-red-200"][
                            availabilityTypes.findIndex(
                              (x) => x === availability,
                            )
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
            <div className="flex justify-between w-full flex-col md:flex-row gap-5">
              {!isNextOfType && match.date >= NOW ? (
                <div className="small italic text-muted-foreground">
                  Set availability after previous Allegro Events complete
                </div>
              ) : null}
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
                  <div className="font-medium mb-2">
                    Can you make it to this match?
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      variant="default"
                      className="cursor-pointer bg-green-700 hover:bg-green-600"
                      onClick={async () => {
                        await setAvailability(match._id!, "available");
                        window.location.replace(window.location.href);
                      }}
                    >
                      <Check /> Yes! I am available
                    </Button>
                    <Button
                      variant="secondary"
                      className="cursor-pointer bg-orange-200 hover:bg-orange-300"
                      onClick={async () => {
                        await setAvailability(match._id!, "maybe");
                        window.location.replace(window.location.href);
                      }}
                    >
                      <Dices /> Maybe
                    </Button>
                    <Button
                      variant="secondary"
                      className="cursor-pointer bg-red-200 hover:bg-red-300"
                      onClick={async () => {
                        await setAvailability(match._id!, "not available");
                        window.location.replace(window.location.href);
                      }}
                    >
                      <X /> Not Available
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
