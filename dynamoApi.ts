import express from "express";
import dotenv from "dotenv";
import serverlessExpress from "@vendia/serverless-express";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

dotenv.config({ path: ".env" });

const app = express();
app.use(express.json());

const TABLE_NAME = process.env.DYNAMO_TABLE;

// DynamoDB client
const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

// SET DATA
app.post("/api/start", async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    await db.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: id,
          name: name,
          start: new Date().toISOString(),
          end: "",
        },
      }),
    );

    res.json({ success: true });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to write to DynamoDB" });
  }
});
app.patch("/api/Finish", async (req, res) => {
  try {
    const { id } = req.body;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update data provided" });
    }

    // Build DynamoDB update expression dynamically
    let UpdateExpression = "set ";
    const ExpressionAttributeNames: Record<string, string> = {};
    const ExpressionAttributeValues: Record<string, unknown> = {};

    const keys = Object.keys(updates);

    keys.forEach((key, index) => {
      UpdateExpression += `#${key} = :${key}`;
      if (index < keys.length - 1) UpdateExpression += ", ";

      ExpressionAttributeNames[`#${key}`] = key;
      ExpressionAttributeValues[`:${key}`] = updates[key];
    });

    const result = await db.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }),
    );

    res.json({
      success: true,
      updated: result.Attributes,
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// GET DATA
app.get("/api/get/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }),
    );

    if (!result.Item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(result.Item);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read from DynamoDB" });
  }
});

// fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Lambda vs Local
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  exports.handler = serverlessExpress({ app });
}
else {
  const PORT = process.env.PORT ?? 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
