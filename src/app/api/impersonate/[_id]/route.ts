import { jwtEncode } from "@/modules/jwt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getUserById } from "@/modules/turso";
import {
  copyUserToImpersonatorCookie,
  getUserInfoFromCookie,
  getUserInfoFromImpersonatorCookie,
} from "@/modules/cookies";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { _id: string } },
) => {
  const cookieStore = await cookies();
  const { _id } = await params;
  const user = await getUserInfoFromCookie();
  const impersonator = await getUserInfoFromImpersonatorCookie();
  if (impersonator.isAdmin || user.isAdmin) {
    const impersonatedUser = await getUserById(_id);
    if (impersonatedUser) {
      await copyUserToImpersonatorCookie();
      const jwt = jwtEncode({
        _id: impersonatedUser._id,
        isAdmin: Boolean(impersonatedUser?.isAdmin),
        isMember: Boolean(impersonatedUser),
        isGuest: !Boolean(impersonatedUser),
      });

      cookieStore.set("user", jwt);
      redirect("/private/matches");
    } else {
      return Response.json({ _id, user, impersonator }, { status: 401 });
    }
  } else {
    return Response.json({ _id, user, impersonator }, { status: 401 });
  }
};
