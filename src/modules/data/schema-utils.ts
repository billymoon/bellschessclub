import {
  any,
  boolean,
  coerce,
  defaulted,
  min,
  nullable,
  number,
  object,
  optional,
  pattern,
  string,
  Struct,
} from "superstruct";

export const InvalidToken = Symbol("InvalidToken");

export const withJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return InvalidToken;
  }
};

export const ISODateString = pattern(
  string(),
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,4})?Z/,
);
export const hashish = pattern(string(), /[a-z0-9-]{4,64}/i);
export const toPosInt = coerce(min(number(), 0), string(), withJSON);
export const toBoolean = coerce(boolean(), string(), withJSON);

export const nullOrPosInt = defaulted(nullable(toPosInt), null);
export const nullOrString = defaulted(nullable(string()), null);
export const nullOrBoolean = (value: boolean) => defaulted(toBoolean, value);
export const grade = defaulted(
  coerce(toPosInt, string(), (val) => {
    if (/^\d+$/.test(val)) {
      return parseInt(val, 10);
    } else {
      return InvalidToken;
    }
  }),
  0,
);

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const ConvertToString = (DataStruct: Struct<any, any>) =>
  object(
    Object.fromEntries(
      Object.entries(DataStruct.schema).map(([key]) => [
        key,
        coerce(optional(string()), any(), (val) =>
          typeof val === "string"
            ? val
            : val == null
            ? ""
            : JSON.stringify(val)),
      ]),
    ),
  );

