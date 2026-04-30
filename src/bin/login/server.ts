import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE!;
const JWT_SECRET = process.env.JWT_SECRET!;

export const handler = async (event: any) => {
  console.log("==== NEW REQUEST ====");
  console.log("Method:", event.httpMethod);
  console.log("Path:", event.path);
  console.log("Headers:", JSON.stringify(event.headers));
  console.log("Body:", event.body);

  const path = event.path;
  const httpMethod = event.httpMethod;

  // ===== SIGNUP =====
  if (path.endsWith("/signup") && httpMethod === "POST") {
    try {
      const { username, password, role, teacherCode } =
        JSON.parse(event.body || "{}");

      console.log("Signup attempt for:", username);

      if (!username || !password || !role) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing required fields" }),
        };
      }

      if (role === "student") {
        if (!teacherCode) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: "Teacher code required" }),
          };
        }

        const teacherResult = await db.send(new GetCommand({
          TableName: USERS_TABLE,
          Key: { username: teacherCode },
        }));

        if (!teacherResult.Item || teacherResult.Item.role !== "teacher") {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid teacher code" }),
          };
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.send(new PutCommand({
        TableName: USERS_TABLE,
        Item: {
          username,
          password: hashedPassword,
          role,
          teacherCode: role === "student" ? teacherCode : null,
        },
        ConditionExpression: "attribute_not_exists(username)",
      }));

      console.log("User created:", username);

      return {
        statusCode: 201,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "User created" }),
      };
    } catch (error: any) {
      console.error("Signup error:", error);

      if (error.name === "ConditionalCheckFailedException") {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: "Username already exists" }),
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Server error" }),
      };
    }
  }

  // ===== LOGIN =====
  if (path.endsWith("/login") && httpMethod === "POST") {
    try {
      const { username, password } = JSON.parse(event.body || "{}");

      console.log("Login attempt for:", username);

      if (!username || !password) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing username or password" }),
        };
      }

      const result = await db.send(new GetCommand({
        TableName: USERS_TABLE,
        Key: { username },
      }));

      if (!result.Item) {
        console.log("User not found:", username);
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Invalid credentials" }),
        };
      }

      const valid = await bcrypt.compare(password, result.Item.password);

      if (!valid) {
        console.log("Invalid password for:", username);
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Invalid credentials" }),
        };
      }

      const token = jwt.sign({ username, role: result.Item.role }, JWT_SECRET, { expiresIn: "1h" });

      console.log("Login success:", username);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          username,
          role: result.Item.role,
        }),
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Server error" }),
      };
    }
  }

  console.log("Unhandled route:", path);

  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Not Found" }),
  };
};