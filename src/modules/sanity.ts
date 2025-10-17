"use server";
import { AttributeSet, createClient } from "@sanity/client";
import { getUserInfoFromCookie } from "./cookies";
import {
  AllegroEvent,
  AvailabilityTypes,
  Match,
  MatchDocument,
  Member,
  SanityDocProps,
} from "./schema";
import { create } from "superstruct";

const client = createClient({
  projectId: "rzzlhpv8",
  dataset: process.env.SANITY_STUDIO_DATASET || "develop",
  useCdn: false, // set to `true` to fetch from edge cache
  apiVersion: "2022-01-12", // use current date (YYYY-MM-DD) to target the latest API version
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

const throwUnlessAdmin = (fn: unknown) => async (...args: unknown[]) => {
  const { isAdmin } = await getUserInfoFromCookie();
  if (isAdmin) {
    // @ts-ignore
    return fn(...args);
  } else {
    throw Error("not allowed - not admin");
  }
};

export const getDocuments = async () => await client.fetch(`*[!(_type match "system.*")]`);

export const deleteDocument = async (_id: SanityDocProps["_id"]) =>
  await client.delete(_id);

const updateDocument = (
  _id: SanityDocProps["_id"],
  data: AttributeSet,
) => client.patch(_id).set(data).commit();

export const updateDocumentAdmin = throwUnlessAdmin(updateDocument);

export const updateMyself = async (
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  { isAdmin, active, ...data }: AttributeSet,
) => {
  const { _id } = await getUserInfoFromCookie();
  if (_id) {
    await client.patch(_id).set({ ...data }).commit();
    return "ok";
  } else {
    throw Error("not allowed - not admin");
  }
};

export const getUsers = async (active = true): Promise<Member[]> =>
  (await client.fetch(
    `*[_type == "member"${
      active ? " && active == true" : ""
    }] | order(standardPublished desc)`,
  )).map((data: Member) => create(data, Member));

export const getMatches = async (): Promise<Match[]> =>
  (await client.fetch(
    `*[_type == "match"] { ...@, "availability": players[]{ "name": player->name, availability, rating } } | order(date asc)`,
  )).map((data: Match) => create(data, Match));

export const getAllAvailabilityForMatch = async (
  match_id: MatchDocument["_id"],
) =>
  await client.fetch(
    `*[_type == "match" && _id == "${match_id}"].players | { "player": player->name, availability }[]`,
  );

export const setAvailabilityForMatch = async (
  match_id: MatchDocument["_id"],
  availability: AvailabilityTypes,
) => {
  const { _id, username } = await getUserInfoFromCookie();
  const member = await getUser(username);
  await client.patch(match_id)
    .setIfMissing({ players: [] })
    .unset([`players[player._ref=="${_id}"]`])
    .append(
      "players",
      [{
        player: {
          _type: "reference",
          _ref: _id,
        },
        availability,
        rating: member.standardPublished,
      }],
    ).commit();
};

export const getAllegroEvents = async (): Promise<AllegroEvent[]> =>
  (await client.fetch(
    `*[_type == "allegro"] | order(date asc)`,
  )).map((data: AllegroEvent) => create(data, AllegroEvent));

export const getMemberByPnum = async (pnum: Member["pnum"]) =>
  await client.fetch(
    `*[_type == "member" && (pnum == "${pnum}" || pnum == ${pnum})][0]`,
  );

export const updateDocumentById = async (
  _id: SanityDocProps["_id"],
  data: AttributeSet,
) => {
  const { isAdmin } = await getUserInfoFromCookie();
  if (isAdmin) {
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

export const getDocument = async (_id: SanityDocProps["_id"]) =>
  await client.getDocument(_id);
