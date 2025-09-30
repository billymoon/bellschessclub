"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "@/modules/jwt";

export const getUsernameFromCookie = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  const username = userCookie
    ? jwtDecode(userCookie.value).username
    : undefined;
  return username;
};

export const getUserInfoFromCookie = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  const { username, isAdmin, isMember, isGuest } = userCookie
    ? jwtDecode(userCookie.value)
    : undefined;

  return { username, isAdmin, isMember, isGuest };
};
