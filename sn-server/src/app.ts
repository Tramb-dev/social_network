import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import http from "http";
import { PORT } from "./config";
import route from "./routes/index";

const app: Application = express();
const server = http.createServer(app);
const corsOptions = {
  origin: ["http://localhost:4200"],
};

// Server settings
/* app.set('env', config.env);
app.set('port', config.port);
app.set('hostname', config.hostname);
app.set('viewDir', config.viewDir); */

app.use(express.json());
app.use(cors(corsOptions));
//app.use(session({ secret: "hoogie-boogie" }));

// Set up routes
app.use(route);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: error.message,
  });
});

app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
