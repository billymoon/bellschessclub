import {
  any,
  array,
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
  type,
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
  coerce(toPosInt, string(), (val) => {
    if (/^\d+$/.test(val)) {
      return parseInt(val, 10);
    } else {
      return InvalidToken;
    }
  }),
  0,
);

export const SanityDocProps = type({
  _createdAt: ISODateString,
  _id: hashish,
  _rev: hashish,
  _type: string(),
  _updatedAt: ISODateString,
});
export type SanityDocProps = Infer<typeof SanityDocProps>;

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

export const Member = assign(partial(SanityDocProps), MemberData);

export const MemberDocument = assign(SanityDocProps, MemberData);

export type Member = Infer<typeof Member>;

export const MemberPartial = partial(Member);
export type MemberPartial = Infer<typeof MemberPartial>;
export type MemberDocument = Infer<typeof MemberDocument>;

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const ConvertToString = (DataStruct: Struct<any, any>) =>
  object(
    Object.fromEntries(
      Object.entries(DataStruct.schema).map(([key]) => [
        key,
        coerce(optional(string()), any(), (val) =>
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

export const AvailabilityTypes = enums(["available", "maybe", "not available"]);
export type AvailabilityTypes = Infer<typeof AvailabilityTypes>;

const MemberReference = object({
  _key: optional(string()),
  player: object({
    _ref: string(),
    _type: defaulted(enums(["reference"]), "reference"),
  }),
  availability: AvailabilityTypes,
  rating: optional(nullable(number())),
});

export const MatchData = object({
  _type: defaulted(enums(["match"]), "match"),
  date: ISODateString,
  isAtHome: toBoolean,
  opponent: string(),
  team: coerce(enums([1, 2]), string(), withJSON),
  venue: string(),
  players: defaulted(array(MemberReference), []),
});

export const Match = assign(
  partial(SanityDocProps),
  MatchData,
  object({
    availability: nullable(
      defaulted(
        array(
          object({
            name: string(),
            availability: AvailabilityTypes,
            rating: optional(nullable(number())),
          }),
        ),
        [],
      ),
    ),
  }),
);
export type Match = Infer<typeof Match>;

export const MatchDocument = assign(SanityDocProps, MatchData);
export type MatchDocument = Infer<typeof MatchDocument>;

export const MatchPartial = partial(Match);
export type MatchPartial = Infer<typeof MatchPartial>;

export const MatchDataStringified = ConvertToString(MatchData);
export const MatchStringified = ConvertToString(Match);

export const AllegroEventData = object({
  _type: defaulted(enums(["allegro"]), "allegro"),
  date: ISODateString,
  opponents: array(string()),
  players: defaulted(array(MemberReference), []),
});

export const AllegroEvent = assign(
  partial(SanityDocProps),
  AllegroEventData,
  object({
    availability: nullable(
      defaulted(
        array(
          object({
            name: string(),
            availability: AvailabilityTypes,
            rating: optional(nullable(number())),
          }),
        ),
        [],
      ),
    ),
  }),
);

export const AllegroEventDocument = assign(SanityDocProps, AllegroEventData);

export type AllegroEventDocument = Infer<typeof AllegroEventDocument>;
export type AllegroEvent = Infer<typeof AllegroEvent>;

export const AllegroEventPartial = partial(AllegroEvent);
export type AllegroEventPartial = Infer<typeof AllegroEventPartial>;

export const AllegroEventDataStringified = ConvertToString(AllegroEventData);
export const AllegroEventStringified = ConvertToString(AllegroEvent);

// const mem = create(
//   {
//     date: "2025-10-28T19:15:00.000Z",
//     opponents: ["Musselburgh 1", "Musselburgh 2"],
//   },
//   AllegroEventPartial,
//   // AllegroEvent,
//   // AllegroEventDocument,
//   // AllegroEventStringified,
// );
// // const str = create(mem, AllegroEventStringified);
// console.log(
//   mem,
//   // str,
//   // create(str, AllegroEvent)
//   // AllegroEvent.schema
// );
