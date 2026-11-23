import {
  array,
  assign,
  coerce,
  defaulted,
  enums,
  Infer,
  nullable,
  number,
  object,
  optional,
  partial,
  size,
  string,
  type,
} from "superstruct";
import { ConvertToString, ISODateString, hashish, toBoolean, withJSON } from "./schema-utils";

export const SanityDocProps = type({
  _createdAt: ISODateString,
  _id: hashish,
  _rev: hashish,
  _type: string(),
  _updatedAt: ISODateString,
});
export type SanityDocProps = Infer<typeof SanityDocProps>;

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
  opponent: size(string(), 1, Infinity),
  team: coerce(enums([0, 1, 2, 3]), string(), withJSON),
  venue: string(),
  mapLink: optional(string()),
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
            pnum: optional(nullable(number())),
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
