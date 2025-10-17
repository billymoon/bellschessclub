import { jwtEncode } from "@/modules/jwt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getUser } from "@/modules/turso";
import {
  copyUserToImpersonatorCookie,
  getUserInfoFromCookie,
  getUserInfoFromImpersonatorCookie,
} from "@/modules/cookies";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { username: string } },
) => {
  const cookieStore = await cookies();
  const {
    username,
  } = await params;
  const user = await getUserInfoFromCookie();
  const impersonator = await getUserInfoFromImpersonatorCookie();
  if (impersonator.isAdmin || user.isAdmin) {
    const impersonatedUser = await getUser(username);
    if (impersonatedUser) {
      await copyUserToImpersonatorCookie();
      const jwt = jwtEncode(
        {
          _id: impersonatedUser._id,
          username: impersonatedUser.username,
          isAdmin: Boolean(impersonatedUser?.isAdmin),
          isMember: Boolean(impersonatedUser),
          isGuest: !Boolean(impersonatedUser),
        },
      );

      cookieStore.set("user", jwt);
      redirect("/private/profile");
    } else {
      return Response.json({ username, user, impersonator }, { status: 401 });
    }
  } else {
    return Response.json({ username, user, impersonator }, { status: 401 });
  }
};
