import net from 'net';
import express from 'express';
import path from 'path';
import type { Express } from 'express';

export const startServer = (port?: number) => new Promise<[Express, number]>(async (res) => {
  const selectedPort = typeof port === 'number' ? port : await getRandomPort();
  const app = express();
  const virtualPath = path.resolve(__dirname, "virtual-app");

  app.use(express.static(virtualPath));

  app.get("*", (_req, res) => {
    const indexPath = path.join(virtualPath, "index.html");
    res.sendFile(indexPath);
  });

  app.listen(selectedPort, () => {
    res([app, selectedPort]);
  });
});

const checkPortAvailability = (port: number) => {
  const server = net.createServer();

  return new Promise((resolve, reject) => {
    server.once('error', (err) => {
      if ('code' in err && err.code === 'EADDRINUSE') {
        // port is currently in use
        resolve(false);
      } else {
        reject(err);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
};

const getRandomPort = async () => {

  let found = false;
  let tries = 0;

  while (!found && tries < 100) {
    const port = Math.floor(Math.random() * 2000) + 7000;
    const isAvailable = await checkPortAvailability(port);
    if (isAvailable) {
      found = true;
      return port;
    }
    tries++;
  }

  throw new Error('Could not find an available port. Try again.');

}
