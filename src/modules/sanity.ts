"use server";
import { AttributeSet, createClient } from "@sanity/client";
import { getUserInfoFromCookie } from "./cookies";
import { AllegroEvent, Match, Member, MemberDocument } from "./schema";
import { create } from "superstruct";

const client = createClient({
  projectId: "rzzlhpv8",
  dataset: "production",
  useCdn: false, // set to `true` to fetch from edge cache
  apiVersion: "2022-01-12", // use current date (YYYY-MM-DD) to target the latest API version
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

export const getDocuments = async () => await client.fetch(`*`);

export const getUsers = async (active = true): Promise<Member[]> =>
  (await client.fetch(
    `*[_type == "member"${
      active ? " && active == true" : ""
    }] | order(standardPublished desc)`,
  )).map((data: Member) => create(data, Member));

export const getMatches = async (): Promise<Match[]> =>
  (await client.fetch(
    `*[_type == "match"] | order(date asc)`,
  )).map((data: Match) => create(data, Match));

export const getAllegroEvents = async (): Promise<AllegroEvent[]> =>
  (await client.fetch(
    `*[_type == "allegro"] | order(date asc)`,
  )).map((data: AllegroEvent) => create(data, AllegroEvent));

export const deleteDocument = async (_id: MemberDocument["_id"]) =>
  await client.delete(_id);

export const getMemberByPnum = async (pnum: Member["pnum"]) =>
  await client.fetch(
    `*[_type == "member" && (pnum == "${pnum}" || pnum == ${pnum})][0]`,
  );

export const updateDocumentById = async (
  _id: MemberDocument["_id"],
  data: AttributeSet,
) => {
  const { isAdmin } = await getUserInfoFromCookie();
  if (isAdmin) {
    console.log({ _id, data });
    await client.patch(_id).set(data).commit();
    return "ok";
  } else {
    throw Error("not allowed - not admin");
  }
};

export const getUser = async (username: Member["username"]) =>
  await client.fetch(`*[_type == "member" && username == "${username}"][0]`);

export const createUser = async (
  username: Member["username"],
  data: AttributeSet,
) => {
  const user = await getUser(username);
  if (!user) {
    await client.create({
      ...data,
      _type: "user",
      username,
    });
  }
};

export const getDocument = async (_id: MemberDocument["_id"]) =>
  await client.getDocument(_id);
