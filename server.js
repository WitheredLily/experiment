"use strict";
// File: server.ts
// Install (dev): npm i -D typescript ts-node-dev @types/express @types/node
// Install (runtime): npm i express
// Add to `package.json` scripts:
// "serve": "ts-node-dev --respawn --transpile-only server.ts"
// Or compile: "build-server": "tsc server.ts" and run the produced JS with node.
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = require("path");
var app = (0, express_1.default)();
var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
var buildDir = path_1.default.join(__dirname, 'build');
// Serve static assets from `build/`
app.use(express_1.default.static(buildDir));
// API endpoint that returns the app HTML
app.get('/api/send-app', function (req, res) {
    res.sendFile(path_1.default.join(buildDir, 'index.html'));
});
// Optional fallback for client-side routing
app.get('*', function (req, res) {
    res.sendFile(path_1.default.join(buildDir, 'index.html'));
});
app.listen(PORT, function () {
    console.log("Server listening on http://localhost:".concat(PORT));
});
