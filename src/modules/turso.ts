"use server";
import { AttributeSet, SanityDocument } from "@sanity/client";
import { getUserInfoFromCookie } from "./cookies";
import {
    AllegroEvent,
    AllegroEventDocument,
    AvailabilityTypes,
    Match,
    MatchDocument,
    Member,
    SanityDocProps,
} from "./schema";
import { create } from "superstruct";
import { createClient as tursoClient } from "@libsql/client";
import { evaluate, parse } from "groq-js";

const turso = tursoClient({
    url: process.env.TURSO_URL || "file::memory:",
    authToken: process.env.TURSO_TOKEN,
});

let documents: SanityDocument[] = [];

export const queryAllDocuments = async (query: string = "") => {
    // if (documents?.length === 0) {
    documents = await queryDocuments();
    // }
    const tree = parse(query);

    const value = await evaluate(tree, { dataset: documents });

    const result = await value.get();
    return result;
};

export const queryDocuments = async (
    conditions: string = "",
): Promise<SanityDocument[]> => {
    const result = await turso.execute(
        `select _id, _rev, _createdAt, _updatedAt, _type, data from documents ${conditions}`,
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

const throwUnlessAdmin = (fn: unknown) => async (...args: unknown[]) => {
    const { isAdmin } = await getUserInfoFromCookie();
    if (isAdmin) {
        // @ts-ignore
        return fn(...args);
    } else {
        throw Error("not allowed - not admin");
    }
};

export const getDocuments = async () =>
    await queryAllDocuments(`*[!(_type match "system.*")]`);

export const deleteDocument = async (_id: SanityDocProps["_id"]) => {
    await turso.execute(`delete from documents where _id == '${_id}'`);
    documents = [];
};

const updateDocument = async (
    _id: SanityDocProps["_id"],
    data: AttributeSet,
) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
        _createdAt,
        _id: _unused,
        _ref,
        _updatedAt,
        _type,
        ...docData
    } = await getDocument(_id);
    await turso.execute(
        `update documents set data = '${
            JSON.stringify({ ...docData, ...data })
        }' where _id == '${_id}'`,
    );

    documents = [];
};

export const updateDocumentAdmin = throwUnlessAdmin(updateDocument);

export const updateMyself = async (
    { isAdmin, active, ...data }: AttributeSet,
) => {
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
        await turso.execute(
            `update documents set data = '${
                JSON.stringify({ ...docData, ...data })
            }' where _id == '${_id}'`,
        );
        documents = [];
        return "ok";
    } else {
        throw Error("not allowed - not admin");
    }
};

export const getUsers = async (active = true): Promise<Member[]> =>
    (await queryAllDocuments(
        `*[_type == "member"${
            active ? " && active == true" : ""
        }] | order(standardPublished desc)`,
    )).map((data: Member) => create(data, Member));

export const getMatches = async (): Promise<Match[]> =>
    (await queryAllDocuments(
        `*[_type == "match"] { ...@, "availability": players[]{ "name": player->name, availability, rating } } | order(date asc)`,
    )).map((data: Match) => create(data, Match));

export const getAllAvailabilityForMatch = async (
    match_id: MatchDocument["_id"],
) => await queryAllDocuments(
    `*[_type == "match" && _id == "${match_id}"].players | { "player": player->name, availability }[]`,
);

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
        _ref,
        _updatedAt,
        _type,
        ...matchdocData
    } = await getDocument(match_id);
    matchdocData.players = matchdocData.players || [];
    matchdocData.players = [
        ...matchdocData.players.filter((
            { player }: { player: MatchDocument["players"][0]["player"] },
        ) => player._ref !== _id),
        {
            player: {
                _type: "reference",
                _ref: _id,
            },
            availability,
            rating: member.standardPublished,
        },
    ];
    await turso.execute(
        `update documents set data = '${
            JSON.stringify(matchdocData)
        }' where _id == '${match_id}'`,
    );

    documents = [];
};
export const getAllAvailabilityForAllegroEvent = async (
    match_id: AllegroEventDocument["_id"],
) => await queryAllDocuments(
    `*[_type == "allegro" && _id == "${match_id}"].players | { "player": player->name, availability }[]`,
);

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
    console.log({
        _createdAt,
        _id: _unused,
        _ref,
        _updatedAt,
        _type,
        ...matchdocData,
    });
    matchdocData.players = matchdocData.players || [];
    matchdocData.players = [
        ...matchdocData.players.filter((
            { player }: {
                player: AllegroEventDocument["players"][0]["player"];
            },
        ) => player._ref !== _id),
        {
            player: {
                _type: "reference",
                _ref: _id,
            },
            availability,
            rating: member.standardPublished,
        },
    ];
    await turso.execute(
        `update documents set data = '${
            JSON.stringify(matchdocData)
        }' where _id == '${match_id}'`,
    );

    documents = [];
};

export const getAllegroEvents = async (): Promise<AllegroEvent[]> =>
    (await queryAllDocuments(
        `*[_type == "allegro"] { ...@, "availability": players[]{ "name": player->name, availability, rating } } | order(date asc)`,
    )).map((data: AllegroEvent) => create(data, AllegroEvent));

export const getMemberByPnum = async (pnum: Member["pnum"]) =>
    await queryAllDocuments(
        `*[_type == "member" && (pnum == "${pnum}" || pnum == ${pnum})][0]`,
    );

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
        await turso.execute(
            `update documents set data = '${
                JSON.stringify({ ...docData, ...data })
            }' where _id == '${_id}'`,
        );
        documents = [];
        return "ok";
    } else {
        throw Error("not allowed - not admin");
    }
};

export const getUserByLichessUsername = async (
    lichessUsername: Member["lichessUsername"],
) => await queryAllDocuments(
    `*[_type == "member" && lichessUsername == "${lichessUsername}"][0]`,
);

export const getUserById = async (_id: Member["_id"]) =>
    await queryAllDocuments(
        `*[_type == "member" && _id == "${_id}"][0]`,
    );

export const getDocument = async (_id: SanityDocProps["_id"]) =>
    await queryAllDocuments(`*[_id == "${_id}"][0]`);
