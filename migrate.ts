"use server";
import { createClient as sanityClient } from "@sanity/client";
import { createClient as tursoClient } from "@libsql/client";

const turso = tursoClient({
  url: process.env.TURSO_URL || "file::memory:",
  authToken: process.env.TURSO_TOKEN,
});

const client = sanityClient({
  projectId: "rzzlhpv8",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  useCdn: false, // set to `true` to fetch from edge cache
  apiVersion: "2022-01-12", // use current date (YYYY-MM-DD) to target the latest API version
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

const sanityDocuments = await client.fetch(`*[!(_type match "system.*")]`);

const mapped = sanityDocuments.map(
  (
    // @ts-ignore
    { _id, _createdAt, _updatedAt, _rev, _type, ...data },
  ) =>
    `INSERT INTO documents (_id, _createdAt, _updatedAt, _rev, _type, data) VALUES ('${_id}', '${_createdAt}', '${_updatedAt}', '${_rev}', '${_type}', '${JSON.stringify(
      data,
    ).replace(/'/g, "''")}')`,
);

await turso.execute(`drop table documents;`);
await turso.execute(`CREATE TABLE if not exists documents (
    _id text PRIMARY KEY NOT NULL,
    _rev text,
    _createdAt text,
    _updatedAt text,
    _type text,
    data text
);`);
// await turso.execute(`delete from documents;`);
for (let stmt of mapped) {
  try {
    console.log(stmt);
    // await turso.execute(stmt);
  } catch (err) {
    console.log(err, stmt);
  }
}
// await turso.execute(`select * from documents;`);
