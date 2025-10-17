import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Member } from "@/modules/schema";
import { Button } from "./ui/button";
import { useState } from "react";
import { SiChessdotcom, SiLichess } from "react-icons/si";
import Link from "next/link";

export function MembersTable({
  members,
  isAdmin = false,
}: {
  members: Member[];
  isAdmin?: Member["isAdmin"];
}) {
  const [showAll, setShowAll] = useState(false);
  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>
          Club Members{" "}
          {isAdmin ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              Show {showAll ? "active" : "all"}
            </Button>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pnum</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Standard Rating</TableHead>
              <TableHead>Allegro Rating</TableHead>
              <TableHead>Sites</TableHead>
              <TableHead>Is Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members
              .filter(({ active }) => showAll || active)
              .map((member) => (
                <TableRow key={member._id}>
                  <TableCell className="font-medium p-0">
                    <Link
                      href={`https://www.chessscotland.com/grading/player/${member.pnum}`}
                      className="hover:underline"
                    >
                      <div className="p-[10]">{member.pnum}</div>
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell
                    className="font-medium"
                    title={`Published: ${member.standardPublished}\nLive: ${member.standardLive}`}
                  >
                    {member.standardPublished}
                  </TableCell>
                  <TableCell
                    className="font-medium"
                    title={`Published: ${member.allegroPublished}\nLive: ${member.allegroLive}`}
                  >
                    {member.allegroPublished}
                  </TableCell>
                  <TableCell className="font-medium p-0">
                    {member.lichessUsername ? (
                      <Button asChild variant="ghost" className="text-3xl">
                        <Link
                          href={`https://lichess.org/@/${member.lichessUsername}`}
                          className="hover:underline"
                        >
                          <SiLichess />
                        </Link>
                      </Button>
                    ) : null}
                    {member.chesscomUsername ? (
                      <Button asChild variant="ghost" className="text-3xl">
                        <Link
                          href={`https://www.chess.com/member/${member.chesscomUsername}`}
                          className="hover:underline"
                        >
                          <SiChessdotcom />
                        </Link>
                      </Button>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.isAdmin
                          ? "default"
                          : member.active
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {member.isAdmin
                        ? "Admin"
                        : member.active
                          ? "Member"
                          : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
