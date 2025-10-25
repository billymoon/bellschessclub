import { getUserInfoFromCookie } from "@/modules/cookies";
import { EditPage } from "./EditPage";
import { getUserById } from "@/modules/turso";

export default async function Page() {
  const { _id } = await getUserInfoFromCookie();
  const member = await getUserById(_id);
  return <EditPage member={member} />;
}
