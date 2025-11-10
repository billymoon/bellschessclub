"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "@/modules/jwt";
import { Member } from "@/modules/schema";

type UserCookie = {
  isAdmin: Member["isAdmin"];
  isGuest: boolean;
  isMember: boolean;
  username: Member["username"];
  _id: Member["_id"];
};

export const getUserInfoFromCookie = async (): Promise<UserCookie> => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  if (userCookie) {
    const { _id, username, isAdmin, isMember, isGuest } = jwtDecode(
      userCookie.value,
    ) as UserCookie;
    return { _id, username, isAdmin, isMember, isGuest };
  } else {
    return {
      _id: undefined,
      username: null,
      isAdmin: false,
      isMember: false,
      isGuest: true,
    };
  }
};

export const copyUserToImpersonatorCookie = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  if (userCookie) {
    const { exp } = jwtDecode(userCookie.value);
    return cookieStore.set("impersonator", userCookie.value, {
      expires: exp * 1000,
    });
  }
};

export const getUserInfoFromImpersonatorCookie =
  async (): Promise<UserCookie> => {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("impersonator");
    if (userCookie) {
      const { _id, username, isAdmin, isMember, isGuest } = jwtDecode(
        userCookie.value,
      ) as UserCookie;
      return { _id, username, isAdmin, isMember, isGuest };
    } else {
      return {
        _id: undefined,
        username: null,
        isAdmin: false,
        isMember: false,
        isGuest: true,
      };
    }
  };
