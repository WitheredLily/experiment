"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const serverless_express_1 = __importDefault(require("@vendia/serverless-express"));
dotenv_1.default.config({ path: '.env' });
const app = (0, express_1.default)();
const buildDir = path_1.default.join(__dirname, 'build');
app.use(express_1.default.static(buildDir));
app.get('/api/send-app', (req, res) => {
    res.sendFile(path_1.default.join(buildDir, 'index.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(buildDir, 'index.html'));
});
// Detect whether we're running locally or in Lambda
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    // Running inside AWS Lambda
    exports.handler = (0, serverless_express_1.default)({ app });
}
else {
    // Running locally
    const PORT = process.env.PORT ?? 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally at http://localhost:${PORT}`);
    });
}
