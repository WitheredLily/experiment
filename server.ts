import express from "express";
import dotenv from "dotenv";
import serverlessExpress from "@vendia/serverless-express";

dotenv.config({ path: ".env" });

const app = express();

const WEBSITE_BUCKET_URL = process.env.WEBSITE_BUCKET_URL!;

// Redirect API or SPA routes to S3
app.get("*", (req, res) => {
  // If you have a real API route like /api/send-app, handle it here
  if (req.path.startsWith("/api/")) {
    res.status(404).send({ error: "API route not found" });
    return;
  }

  // Redirect everything else to S3 website
  const redirectUrl = `${WEBSITE_BUCKET_URL}${req.path === "/" ? "/page0" : req.path}`;
  res.redirect(302, redirectUrl);
});

// Lambda vs Local
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  exports.handler = serverlessExpress({ app });
}
else {
  const PORT = process.env.PORT ?? 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally at http://localhost:${PORT}`);
  });
}
