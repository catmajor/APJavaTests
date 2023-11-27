const express = require("express");
const site = express();
const fs = require("fs");
const port = 8443;

site.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  let html = fs.readFileSync("./pages/main/main-index.html", "utf-8");
  let css = fs.readFileSync("./pages/main/main-style.css", "utf-8");
  let js = fs.readFileSync("./pages/main/main-script.js", "utf-8");
  html = html.replace("#$#THIS-WILL-BE-REPLACED-WITH-STYLE-CONTENT#$#", css);
  html = html.replace("#$#THIS-WILL-BE-REPLACED-WITH-JS-CONTENT#$#", js)
  res.send(html);
});

site.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
