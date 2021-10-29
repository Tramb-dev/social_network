const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
