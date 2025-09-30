/* eslint-disable */
import {
  coerce,
  create,
  defaulted,
  define,
  Infer,
  is,
  max,
  number,
  object,
  optional,
  pattern,
  refine,
  size,
  string,
} from "superstruct";

const example = () =>
  define("example", (value) => is(value, pattern(string(), /ex.+/)));
// const Positive = refine(string(), 'positive', (value) => is(value, pattern(string(), /ex.+/)) || "not positive")

let i = 0;

// const log = (...x) => Boolean(console.log(...x));

export const User = object({
  username: size(string(), 3, 10),
  pnum: max(
    coerce(number(), string(), (value) => parseInt(value, 10)),
    123,
  ),
  // _id: defaulted(string(), (...x) => (++i).toString()),
});

export type User = Infer<typeof User>;

console.log(
  create(
    {
      username: "Nice",
      pnum: 123,
    },
    User,
  ),
);

// try {
//     console.log(create({
//         username: "Ni",
//     }, User));
// } catch (err) {
//     console.log(1, err.failures(console.log));
// }
