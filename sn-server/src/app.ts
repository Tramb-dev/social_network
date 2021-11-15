import express, { Application } from "express";
import http from "http";
import { PORT } from "./config";
import route from "./routes/index";

const app: Application = express();
const server = http.createServer(app);

// Server settings
/* app.set('env', config.env);
app.set('port', config.port);
app.set('hostname', config.hostname);
app.set('viewDir', config.viewDir); */

app.use(express.json());

// Set up routes
app.use(route);

app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
