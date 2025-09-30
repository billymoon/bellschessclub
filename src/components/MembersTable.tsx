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
import { MemberState } from "@/stores/member-store";
import { getUserInfoFromCookie } from "@/modules/cookies";

export function MembersTable({
  members,
  isAdmin = false,
}: {
  members: MemberState["member"][];
}) {
  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>Club Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Pnum</TableHead>
              <TableHead>Lichess</TableHead>
              <TableHead>Standard Rating</TableHead>
              <TableHead>Allegro Rating</TableHead>
              <TableHead>Is Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.pnum}>
                <TableCell className="font-medium">
                  {isAdmin ? (
                    <a
                      href={`/members/admin/edit/${member.pnum}`}
                      className="hover:underline"
                    >
                      <div className="p-[10]">{member.name}</div>
                    </a>
                  ) : (
                    member.name
                  )}
                </TableCell>
                <TableCell className="font-medium p-0">
                  <a
                    href={`https://www.chessscotland.com/grading/player/${member.pnum}`}
                    className="hover:underline"
                  >
                    <div className="p-[10]">{member.pnum}</div>
                  </a>
                </TableCell>
                <TableCell className="font-medium p-0">
                  {member.lichessUsername ? (
                    <a
                      href={`https://lichess.org/@/${member.lichessUsername}`}
                      className="hover:underline"
                    >
                      <div className="p-[10]">{member.lichessUsername}</div>
                    </a>
                  ) : null}
                </TableCell>
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
                <TableCell>
                  <Badge variant={member.isAdmin ? "default" : "secondary"}>
                    {member.isAdmin ? "Admin" : "Member"}
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
