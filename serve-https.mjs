// HTTPS static server so the PWA works on the local network.
// Usage: node serve-https.mjs   →  https://<lan-ip>:8443
import https from 'node:https';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = import.meta.dirname;
const PORT = 8443;
const IP = process.argv[2] ?? '192.168.2.111';

const types = {
  '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.gif': 'image/gif', '.css': 'text/css',
};

const server = https.createServer(
  {
    cert: await readFile(join(ROOT, 'localhost+2.pem')),
    key: await readFile(join(ROOT, 'localhost+2-key.pem')),
  },
  async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path === '/') path = '/index.html';
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    try {
      const data = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404); res.end('not found');
    }
  }
);

server.listen(PORT, () => console.log(`https://${IP}:${PORT}`));
