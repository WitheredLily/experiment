import jwt from "jsonwebtoken";

export function signToken(payload: object, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}