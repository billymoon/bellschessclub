import { getUserInfoFromCookie } from "@/modules/cookies";
import { EditPage } from "./EditPage";
import { getUser } from "@/modules/sanity";

export default async function Page() {
  const { username } = await getUserInfoFromCookie()
  const member = await getUser(username);
  return <EditPage member={member} />;
}
