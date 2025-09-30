import { getUserInfoFromCookie } from "@/modules/cookies";
import { EditPage } from "./EditPage";
import { getMemberByPnum } from "@/modules/sanity";

export default async function Page({ params }) {
  const pnum = (await params).pnum[0];
  const { username, isAdmin } = await getUserInfoFromCookie();
  const member = await getMemberByPnum(pnum);
  return <EditPage member={member} />;
}
