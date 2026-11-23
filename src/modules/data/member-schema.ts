import {
  any,
  assign,
  coerce,
  defaulted,
  enums,
  Infer,
  object,
  optional,
  partial,
  string,
  Struct,
} from "superstruct";
import { SanityDocProps } from "./document-schema";
import { nullOrBoolean, grade, nullOrString, nullOrPosInt, ConvertToString } from "./schema-utils";

export const MemberData = object({
  _type: defaulted(enums(["member"]), "member"),
  active: nullOrBoolean(true),
  allegroPublished: grade,
  allegroIsEstimated: nullOrBoolean(false),
  chesscomUsername: nullOrString,
  isAdmin: nullOrBoolean(false),
  lichessUsername: nullOrString,
  name: nullOrString,
  pnum: nullOrPosInt,
  standardPublished: grade,
  standardIsEstimated: nullOrBoolean(false),
  username: nullOrString,
  generalAvailability: defaulted(
    enums(["all", "most", "some", "none"]),
    "some",
  ),
});

export const Member = assign(partial(SanityDocProps), MemberData);

export const MemberDocument = assign(SanityDocProps, MemberData);

export type Member = Infer<typeof Member>;

export const MemberPartial = partial(Member);
export type MemberPartial = Infer<typeof MemberPartial>;
export type MemberDocument = Infer<typeof MemberDocument>;

export const MemberDataStringified = ConvertToString(MemberData);
export const MemberStringified = ConvertToString(Member);