import {
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
  pattern,
  string,
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

const DexieDocumentHeadProps = type({
  _id: hashish,
  _type: string(),
  _createdAt: ISODateString,
  _updatedAt: ISODateString,
  _rev: hashish,
});
type DexieDocumentHeadProps = Infer<typeof DexieDocumentHeadProps>;

export const MemberDocument = assign(
  DexieDocumentHeadProps,
  object({
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
  }),
);

export type MemberDocument = Infer<typeof MemberDocument>;

export type DexieDocument = MemberDocument;
