import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
import { PORT } from "./config";
import route from "./routes/index";
import { SocketIO } from "./io";
import path from "path";

const app: Application = express();
const server = http.createServer(app);
new SocketIO(server);

const publicPath = path.join(__dirname, "public");
app.use(function (req, res, next) {
  console.log("Request was made to: " + req.originalUrl);
  next();
});
app.use(express.static(publicPath));

app.use(express.json());

// Set up routes
app.use(route);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: error.message,
  });
});

app.get("*", (req, res, next) => {
  res.sendFile(path.normalize(publicPath + "/index.html"));
});

server.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
