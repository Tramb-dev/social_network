import express, { Request, Response, Application } from "express";
import http from "http";

const app: Application = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3005;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello world!");
});

app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
