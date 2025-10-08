"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "@/modules/jwt";
import { Member } from "./schema";

type UserCookie = {
  isAdmin: Member["isAdmin"];
  isGuest: boolean;
  isMember: boolean;
  username: Member["username"];
};

export const getUsernameFromCookie = async (): Promise<
  Member["username"] | undefined
> => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  if (userCookie) {
    const { username } = jwtDecode(userCookie.value) as UserCookie;
    return username;
  } else {
    return null;
  }
};

export const getUserInfoFromCookie = async (): Promise<UserCookie> => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  if (userCookie) {
    const { username, isAdmin, isMember, isGuest } = jwtDecode(
      userCookie.value,
    ) as UserCookie;
    return { username, isAdmin, isMember, isGuest };
  } else {
    return { username: null, isAdmin: false, isMember: false, isGuest: true };
  }
};
