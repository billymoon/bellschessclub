import jwt, { JwtPayload } from "jsonwebtoken";
import { aesDecrypt, aesEncrypt } from "@/modules/aes";

const JWT_SECRET =
  process.env.JWT_SECRET || "a-string-secret-at-least-256-bits-long";

export const jwtEncode = (data = {}, secret = {}) =>
  jwt.sign(
    {
      ...data,
      secret: aesEncrypt(secret),
    },
    JWT_SECRET,
  );

export const jwtDecode = (token: string, withSecret = false): JwtPayload => {
  const { secret, ...data } = jwt.verify(token, JWT_SECRET) as {
    secret: string;
  };
  if (withSecret) {
    return {
      ...data,
      secret: aesDecrypt(secret),
    };
  } else {
    return data;
  }
};
