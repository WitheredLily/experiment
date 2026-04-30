import bcrypt from "bcryptjs";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../db";
import { signToken } from "../auth";

const USERS_TABLE = process.env.USERS_TABLE!;
const JWT_SECRET = process.env.JWT_SECRET!;

export const handler = async (event: any) => {
  try {
    const { username, password } = JSON.parse(event.body || "{}");

    if (!username || !password) {
      return { statusCode: 400, body: "Missing credentials" };
    }

    const result = await db.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { username },
    }));

    if (!result.Item) {
      return { statusCode: 401, body: "Invalid credentials" };
    }

    const valid = await bcrypt.compare(password, result.Item.password);

    if (!valid) {
      return { statusCode: 401, body: "Invalid credentials" };
    }

    const token = signToken({ username, role: result.Item.role }, JWT_SECRET);

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        username,
        role: result.Item.role,
      }),
    };
  } catch {
    return { statusCode: 500, body: "Server error" };
  }
};