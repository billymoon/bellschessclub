import { Match } from "@/modules/schema";
import { EditPage } from "./EditPage";
import { getDocument } from "@/modules/sanity";

export default async function Page({ params }) {
  const _id = (await params)._id[0];
  const matchDocument = await getDocument(_id);

  return <EditPage matchDocument={matchDocument as unknown as Match} />;
}
