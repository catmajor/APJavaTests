const express = require("express");
const site = express();
const fs = require("fs");
const port = 8443;

const getPage = (dirName) => {
  let html = fs.readFileSync(`./pages/${dirName}/main-index.html`, "utf-8");
  let css = fs.readFileSync(`./pages/${dirName}/main-style.css`, "utf-8");
  let js = fs.readFileSync(`./pages/${dirName}/main-script.js`, "utf-8");
  html = html.replace("#$#THIS-WILL-BE-REPLACED-WITH-STYLE-CONTENT#$#", css);
  html = html.replace("#$#THIS-WILL-BE-REPLACED-WITH-JS-CONTENT#$#", js);
  return html;
};

site.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const html = getPage("main");
  res.send(html);
});
site.get("/api", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("future api endpoint");
});

site.get("/tests", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const html = getPage("tests");
  res.send(html);
})

site.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
