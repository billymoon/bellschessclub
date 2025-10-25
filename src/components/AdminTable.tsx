import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Member, MemberPartial } from "@/modules/schema";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { updateDocumentById } from "@/modules/turso";

const AdminTableRow = ({ member }: { member: MemberPartial }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      _id: member._id,
      pnum: member.pnum,
      username: member?.username || "",
      status: member.isAdmin ? "admin" : member.active ? "member" : "inactive",
    },
  });

  const onSubmit = async ({
    _id,
    status,
    ...data
  }: MemberPartial & { status: string }) => {
    if (status === "admin") {
      data.isAdmin = true;
      data.active = true;
    } else if (status === "member") {
      data.isAdmin = false;
      data.active = true;
    } else if (status === "inactive") {
      data.isAdmin = false;
      data.active = false;
    }
    data.lichessUsername = data.username;
    await updateDocumentById(_id!, data);
  };
  return (
    <TableRow>
      <TableCell className="font-medium">
        <a
          href={`/api/impersonate/${member._id}`}
          className="hover:underline"
        >
          <div className="p-[10]">{member.name}</div>
        </a>
      </TableCell>
      <TableCell className="font-medium p-0">
        <div className="p-[10]">{member.pnum}</div>
      </TableCell>
      <TableCell className="font-medium p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="flex">
          <div className="p-[10]">
            <Input {...register("username")} className="min-w-[100]" />
          </div>
          <div className="p-[10] flex items-center">
            <select {...register("status")} className="h-[32]">
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="p-[10] flex items-center">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="cursor-pointer"
            >
              Save
            </Button>
          </div>
        </form>
      </TableCell>
    </TableRow>
  );
};

export function AdminTable({ members }: { members: Member[] }) {
  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>Club members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Pnum</TableHead>
              <TableHead>Username / Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <AdminTableRow member={member} key={member._id} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
