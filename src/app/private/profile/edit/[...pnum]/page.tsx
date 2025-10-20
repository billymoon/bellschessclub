import { EditPage } from "./EditPage";
import { getMemberByPnum } from "@/modules/turso";

export default async function Page({ params }) {
  const pnum = (await params).pnum[0];
  const member = await getMemberByPnum(pnum);
  return <EditPage member={member} />;
}
