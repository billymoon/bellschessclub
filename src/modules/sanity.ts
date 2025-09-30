"use server";
import { createClient } from "@sanity/client";
import { getUserInfoFromCookie } from "./cookies";

const client = createClient({
  projectId: "rzzlhpv8",
  dataset: "production",
  useCdn: false, // set to `true` to fetch from edge cache
  apiVersion: "2022-01-12", // use current date (YYYY-MM-DD) to target the latest API version
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

export const getDocuments = async () => await client.fetch(`*`);
export const getUsers = async (active = true) =>
  await client.fetch(
    `*[_type == "member"${
      active ? " && active == true" : ""
    }] | order(standardPublished desc) | order(length(standardPublished) desc)`,
  );
export const deleteDocument = async (_id) => await client.delete(_id);
export const getMemberByPnum = async (pnum) =>
  await client.fetch(`*[_type == "member" && pnum == "${pnum}"][0]`);
export const updateDocumentById = async (_id, data) => {
  const { isAdmin, ...rest } = await getUserInfoFromCookie();
  if (isAdmin) {
    console.log({ _id, data });
    await client.patch(_id).set(data).commit();
    return "ok";
  } else {
    throw Error("not allowed - not admin");
  }
};
export const getUser = async (username) =>
  await client.fetch(`*[_type == "member" && username == "${username}"][0]`);
export const createUser = async (username, data) => {
  const user = await getUser(username);
  if (!user) {
    await client.create({
      ...data,
      _type: "user",
      username,
    });
  }
};
// await client.createIfNotExists({
//   ...data,
//   // _id: `user.${username}`,
//   _type: "user",
//   username,
// });
export const getDocument = async (_id) => await client.getDocument(_id);
