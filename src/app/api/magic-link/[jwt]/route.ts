import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { jwt: string } },
) => {
  const cookieStore = await cookies();
  const { jwt } = await params;
  cookieStore.set("user", jwt);
  redirect("/private/matches");
};
