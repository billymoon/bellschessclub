"use client";
import { FormField } from "@/components/FormField";
import { MembersTable } from "@/components/MembersTable";
import { getUserInfoFromCookie } from "@/modules/cookies";
import { deleteDocument, getDocuments, getUsers } from "@/modules/sanity";
import { useAdminStore } from "@/stores/admin-store-provider";
import { getCookie, setCookie } from "cookies-next";

const getUserCookie = () => {
  try {
    return JSON.parse(atob(getCookie("user").split(".")[1]));
  } catch (err) {
    return {};
  }
};

export default function Page() {
  const { members } = useAdminStore((state) => state);
  const { isAdmin } = getUserCookie();
  // console.log({ userCookie })
  // const { isAdmin } = getUserInfoFromCookie();

  // getUsers().then(console.log)
  // deleteDocument("user.billymoon")
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <MembersTable isAdmin={isAdmin} members={members} />
      {/* <FormField
        name="username"
        label="Username"
        readOnly
        aria-readonly
        value={member.username}
      />
      <FormField
        name="pnum"
        label="Pnum"
        readOnly
        aria-readonly
        value={member.pnum}
      />
      <FormField
        name="chesscomUsername"
        label="Chess.com username"
        readOnly
        aria-readonly
        value={member.chesscomUsername}
      /> */}
      {/* <pre>{JSON.stringify({ members }, null, 2)}</pre> */}
    </div>
  );
}
