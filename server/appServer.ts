import { createServer } from "node:http";
import next from "next";
import { attachSocketServer } from "./socketServer";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = Number(process.env.PORT ?? 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const httpServer = createServer((req, res) => handle(req, res));
    attachSocketServer(httpServer);

    httpServer.listen(port, hostname, () => {
      console.log(`Bridge app listening on http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Bridge server", error);
    process.exit(1);
  });
