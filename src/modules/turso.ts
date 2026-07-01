"use server";
import * as mockdata from "mockdata";
import { AttributeSet, SanityDocument } from "@sanity/client";
import { getUserInfoFromCookie } from "@/modules/cookies";
import {
  AllegroEventDocument,
  AvailabilityTypes,
  MatchDocument,
  Member,
  SanityDocProps,
} from "@/modules/schema";
import { createClient as tursoClient } from "@libsql/client";
import { DexieDocument } from "./dexie/dexie-schema";
import { setDataEpoch } from "./dexie/sanity-update";
import { randomUUID } from "crypto";
// import { unstable_noStore } from "next/cache";

const sqlStringify = (data: unknown) =>
  JSON.stringify(data).replace(/'/g, "''");

const tursoURL = process.env.TURSO_URL || "file::memory:";
const useMockDatabase = tursoURL === "file::memory:";

const turso = tursoClient({
  url: tursoURL,
  authToken: process.env.TURSO_TOKEN,
});

export const updateMatchDocument = async (
  dataIn: DexieDocument,
) => {
  const { isAdmin } = await getUserInfoFromCookie();
  if (isAdmin) {
    const {
      _id,
      _rev: xrev,
      _createdAt,
      _updatedAt: xupdatedAt,
      _type,
      ...data
    } = dataIn;
    const _rev = Math.random().toString().slice(2);

    const [_update, { rows: [{ _updatedAt }] }] = await turso.batch(
      [
        `UPDATE documents SET (
          _rev, _updatedAt, data
        ) = (
          '${_rev}',
          strftime('%FT%R:%fZ'),
          '${sqlStringify(data)}'
        ) WHERE _id = '${_id}';`,
        `select _updatedAt from documents order by _updatedAt desc limit 1;`,
      ],
    );

    await setDataEpoch(_updatedAt as string);

    return { _updatedAt, _rev };
  } else {
    throw Error("not allowed - not admin");
  }
};

export const createMatchDocument = async (
  data: DexieDocument,
  type = "match",
) => {
  // if (useMockDatabase) {
  //   await mockdata.db(turso);
  // }
  const { isAdmin } = await getUserInfoFromCookie();
  if (isAdmin) {
    const uuid = randomUUID();
    const _rev = Math.random().toString().slice(2);

    const [_update, { rows: [{ _updatedAt }] }] = await turso.batch(
      [
        `INSERT INTO documents VALUES(
          '${uuid}',
          '${_rev}',
          strftime('%FT%R:%fZ'),
          strftime('%FT%R:%fZ'),
          '${type}',
          '${sqlStringify(data)}'
        );`,
        `select _updatedAt from documents order by _updatedAt desc limit 1;`,
      ],
    );

    await setDataEpoch(_updatedAt as string);

    console.log({ _updatedAt, _rev });
    return { _updatedAt, _rev };
  } else {
    throw Error("not allowed - not admin");
  }
};

const updateDocument = async (
  _id: DexieDocument["_id"],
  data: DexieDocument,
) => {
  const _rev = Math.random().toString().slice(2);

  const [_update, { rows: [{ _updatedAt }] }] = await turso.batch(
    [
      `update documents set
        data = '${sqlStringify(data)}',
        _updatedAt = strftime('%FT%R:%fZ'),
        _rev = '${_rev}'
        where _id == '${_id}';`,
      `select _updatedAt from documents order by _updatedAt desc limit 1;`,
    ],
  );

  await setDataEpoch(_updatedAt as string);

  return { _updatedAt, _rev };
};

export const getDocumentsSince = async (
  date: string,
): Promise<DexieDocument[]> => {
  // unstable_noStore();
  if (useMockDatabase) {
    await mockdata.db(turso);
  }
  const result = await turso.execute(
    `select _id, _rev, _createdAt, _updatedAt, _type, data from documents where _updatedAt >= '${date}'`,
  );
  return result.rows.map((
    { _id, _rev, _createdAt, _updatedAt, _type, data },
  ) => ({
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    ...JSON.parse(data as string),
  }));
};

export const queryDocuments = async (
  querySuffix = "",
): Promise<SanityDocument[]> => {
  if (useMockDatabase) {
    await mockdata.db(turso);
  }

  const result = await turso.execute(
    `select _id, _type, _createdAt, _updatedAt, _rev, data from documents ${querySuffix};`,
  );

  return result.rows.map((rowData) => {
    const { _id, _rev, _createdAt, _updatedAt, _type, data } =
      rowData as unknown as SanityDocument;
    return {
      ...JSON.parse(data),
      _id,
      _rev,
      _createdAt,
      _updatedAt,
      _type,
    };
  });
};

// const throwUnlessAdmin = (fn: unknown) => async (...args: unknown[]) => {
//   const { isAdmin } = await getUserInfoFromCookie();
//   if (isAdmin) {
//     // @ts-ignore
//     return fn(...args);
//   } else {
//     throw Error("not allowed - not admin");
//   }
// };
// export const updateDocumentAdmin = throwUnlessAdmin(updateDocument);

export const updateMyself = async ({
  isAdmin,
  active,
  ...data
}: AttributeSet) => {
  const { _id } = await getUserInfoFromCookie();
  if (_id) {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      _createdAt,
      _id: _unused,
      _ref,
      _updatedAt,
      _type,
      ...docData
    } = await getDocument(_id);

    return updateDocument(_id, {
      ...docData,
      ...data,
    });
  } else {
    throw Error("not allowed - not admin");
  }
};

export const setAvailabilityForMatch = async (
  match_id: MatchDocument["_id"],
  availability: AvailabilityTypes,
) => {
  const { _id } = await getUserInfoFromCookie();
  const member = await getUserById(_id);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    _createdAt,
    _id: _unused,
    _rev,
    _updatedAt,
    _type,
    ...matchdocData
  } = await getDocument(match_id) as MatchDocument;
  matchdocData.players = matchdocData.players || [];
  matchdocData.players = [
    ...matchdocData.players.filter(
      ({ player }: { player: MatchDocument["players"][0]["player"] }) =>
        player._ref !== _id,
    ),
    {
      player: {
        _type: "reference",
        _ref: _id,
      },
      availability,
    },
  ];
  // TODO: consolidate with this call, and bypass require admin in this case
  // await updateDocumentById(match_id, matchdocData);

  return updateDocument(match_id, matchdocData);
};

export const setAvailabilityForAllegroEvent = async (
  match_id: AllegroEventDocument["_id"],
  availability: AvailabilityTypes,
) => {
  const { _id } = await getUserInfoFromCookie();
  const member = await getUserById(_id);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    _createdAt,
    _id: _unused,
    _ref,
    _updatedAt,
    _type,
    ...matchdocData
  } = await getDocument(match_id);
  matchdocData.players = matchdocData.players || [];
  matchdocData.players = [
    ...matchdocData.players.filter(
      ({ player }: { player: AllegroEventDocument["players"][0]["player"] }) =>
        player._ref !== _id,
    ),
    {
      player: {
        _type: "reference",
        _ref: _id,
      },
      availability
    },
  ];

  return updateDocument(match_id, matchdocData);
};

export const updateDocumentById = async (
  _id: SanityDocProps["_id"],
  data: AttributeSet,
) => {
  const { isAdmin } = await getUserInfoFromCookie();
  if (isAdmin) {
    const {
      _id: _unused,
      _createdAt,
      _updatedAt,
      _rev,
      _type,
      ...docData
    } = await getDocument(_id);

    return updateDocument(_id, {
      ...docData,
      ...data,
    });
  } else {
    throw Error("not allowed - not admin");
  }
};

export const getUserByLichessUsername = async (
  lichessUsername: Member["lichessUsername"],
) =>
  (await queryDocuments(
    `where _type == 'member' and data->>'lichessUsername' == '${lichessUsername}'`,
  )).pop();

export const getUserById = async (_id: Member["_id"]) =>
  (await queryDocuments(`where _type == 'member' and _id == '${_id}'`)).pop();

export const getDocument = async (_id: SanityDocProps["_id"]) =>
  (await queryDocuments(`where _id == '${_id}'`)).pop();
