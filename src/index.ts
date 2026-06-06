import { createServer } from "./server.js";
import { logger } from "./utils/logger.js";

const port = Number.parseInt(process.env.PORT ?? "7000", 10);

const app = createServer();

app.listen(port, () => {
  logger.info({ port }, "Nuvio addon server started");
});
