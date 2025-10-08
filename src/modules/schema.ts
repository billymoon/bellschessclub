import {
  any,
  assign,
  boolean,
  coerce,
  defaulted,
  enums,
  Infer,
  min,
  nullable,
  number,
  object,
  optional,
  partial,
  pattern,
  string,
  Struct,
} from "superstruct";

const InvalidToken = Symbol("InvalidToken");

const withJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return InvalidToken;
  }
};

const ISODateString = pattern(
  string(),
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,4})?Z/,
);
const hashish = pattern(string(), /[a-z0-9-]{4,64}/i);
const toPosInt = coerce(min(number(), 0), string(), withJSON);
const toBoolean = coerce(boolean(), string(), withJSON);

const nullOrPosInt = defaulted(nullable(toPosInt), null);
const nullOrString = defaulted(nullable(string()), null);
const nullOrBoolean = (value: boolean) => defaulted(toBoolean, value);
const grade = defaulted(
  coerce(
    toPosInt,
    string(),
    (val) => {
      if (/^\d+$/.test(val)) {
        return parseInt(val, 10);
      } else {
        return InvalidToken;
      }
    },
  ),
  0,
);

export const SanityDocProps = object({
  _createdAt: ISODateString,
  _id: hashish,
  _rev: hashish,
  _type: string(),
  _updatedAt: ISODateString,
});

export const MemberData = object({
  _type: defaulted(enums(["member"]), "member"),
  active: nullOrBoolean(true),
  allegroLive: grade,
  allegroPublished: grade,
  chesscomUsername: nullOrString,
  isAdmin: nullOrBoolean(false),
  lichessUsername: nullOrString,
  name: nullOrString,
  pnum: nullOrPosInt,
  standardLive: grade,
  standardPublished: grade,
  username: nullOrString,
});

export const Member = assign(
  partial(SanityDocProps),
  MemberData,
);

export const MemberDocument = assign(
  SanityDocProps,
  MemberData,
);

export type Member = Infer<typeof Member>;

export const MemberPartial = partial(Member);
export type MemberPartial = Infer<typeof MemberPartial>;
export type MemberDocument = Infer<typeof MemberDocument>;

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const ConvertToString = (DataStruct: Struct<any, any>) =>
  object(
    Object.fromEntries(
      Object.entries(DataStruct.schema).map((
        [key],
      ) => [
        key,
        coerce(
          optional(string()),
          any(),
          (val) =>
            typeof val === "string"
              ? val
              : val == null
              ? ""
              : JSON.stringify(val),
        ),
      ]),
    ),
  );

export const MemberDataStringified = ConvertToString(MemberData);
export const MemberStringified = ConvertToString(Member);

// const mem = create(
//   {
//     // _createdAt: new Date().toISOString(),
//     // _id: "03b44a9f-d69b-4a6b-a884-1b376fa673e4",
//     // _rev: "AS5i4RvL5zgUXbbUgdW2G1",
//     // _type: "member",
//     // _updatedAt: "2025-09-29T00:45:02Z",
//     active: true,
//     allegroLive: 1103,
//     allegroPublished: 1103,
//     chesscomUsername: null,
//     isAdmin: false,
//     lichessUsername: null,
//     name: "Dowle, Chris",
//     pnum: 29136,
//     standardLive: 1203,
//     standardPublished: 1190,
//     username: null,
//   },
//   // MemberPartial,
//   Member,
//   // MemberDocument,
//   // MemberStringified,
// );
// const str = create(mem, MemberDataStringified);
// console.log(
//   mem,
//   str,
//   create(str, Member),
// );

export const MatchData = object({
  _type: defaulted(enums(["match"]), "match"),
  date: ISODateString,
  day: string(),
  isAtHome: toBoolean,
  opponent: string(),
  team: coerce(enums([1, 2]), string(), withJSON),
  // time: string(),
  venue: string(),
});

export const Match = assign(
  partial(SanityDocProps),
  MatchData,
);

export const MatchDocument = assign(
  SanityDocProps,
  MatchData,
);

export type Match = Infer<typeof Match>;

export const MatchPartial = partial(Match);
export type MatchPartial = Infer<typeof MatchPartial>;

export const MatchDataStringified = ConvertToString(MatchData);
export const MatchStringified = ConvertToString(Match);

// const mem = create(
//   {
//     date: "2025-10-28T19:15:00.000Z",
//     day: "Tuesday",
//     isAtHome: "true",
//     opponent: "Musselburgh 2",
//     team: "2",
//     // time: "1915",
//     venue: "Musselburgh Store Club",
//     _createdAt: "2025-10-08T17:34:23Z",
//     _id: "5512584f-dcff-4272-81d0-8feb0832ec50",
//     _rev: "6WtiBizt6GSRcp6LvNV1pe",
//     _type: "match",
//     _updatedAt: "2025-10-08T17:34:23Z",
//   },
//   // MatchPartial,
//   Match,
//   // MatchDocument,
//   // MatchStringified,
// );
// const str = create(mem, MatchStringified);
// console.log(
//   mem,
//   str,
//   create(str, Match)
//   // Match.schema
// );
