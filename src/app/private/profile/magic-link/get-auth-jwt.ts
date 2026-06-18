"use server";
import { jwtEncode } from "@/modules/jwt";
import { getUserInfoFromCookie } from "@/modules/cookies";

export const getAuthJwt = async () => {
  const user = await getUserInfoFromCookie();
  const jwt = jwtEncode({
    magicLink: true,
    _id: user._id,
    isAdmin: Boolean(user?.isAdmin),
    isMember: Boolean(user),
    isGuest: !Boolean(user),
  });

  return jwt;
};
