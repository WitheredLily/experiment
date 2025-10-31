// File: server.ts
// Install (dev): npm i -D typescript ts-node-dev @types/express @types/node
// Install (runtime): npm i express
// Add to `package.json` scripts:
// "serve": "ts-node-dev --respawn --transpile-only server.ts"
// Or compile: "build-server": "tsc server.ts" and run the produced JS with node.

import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT ?? 3001;
const buildDir = path.join(__dirname, 'build');

// Serve static assets from `build/`
app.use(express.static(buildDir));

// API endpoint that returns the app HTML
app.get('/api/send-app', (req: Request, res: Response) => {
    res.sendFile(path.join(buildDir, 'index.html'));
});

// Optional fallback for client-side routing
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
