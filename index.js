const express = require("express");
const site = express();
const fs = require("fs")
;const port = 8443;

site.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("<h1>Hello World!</h1>");
});

site.listen(port);
