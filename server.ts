import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import serverlessExpress from '@vendia/serverless-express';

dotenv.config({ path: '.env' });

const app = express();
const buildDir = path.join(__dirname, 'build');

app.use(express.static(buildDir));

app.get('/api/send-app', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
});

// Detect whether we're running locally or in Lambda
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    // Running inside AWS Lambda
    exports.handler = serverlessExpress({ app });
} else {
    // Running locally
    const PORT = process.env.PORT ?? 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally at http://localhost:${PORT}`);
    });
}
