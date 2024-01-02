const express = require("express");
const site = express();
const fs = require("fs");
const port = 8443;

const IndentTest = require("./tests-api/translated/indentTest.js");
const TestRunner = require("./tests-api/test-runner.js")
site.use(express.json())    

const getPage = (dirName) => {
  let html = fs.readFileSync(`./pages/${dirName}/${dirName}-index.html`, "utf-8");
  let css = fs.readFileSync(`./pages/${dirName}/${dirName}-style.css`, "utf-8");
  let js = fs.readFileSync(`./pages/${dirName}/${dirName}-script.js`, "utf-8");
  let matrixRain = fs.readFileSync(`./pages/javascript/matrixRain.js`);
  html = html.replace("#$#THIS-WILL-BE-REPLACED-WITH-STYLE-CONTENT#$#", css);
  html = html.replace("#$#THIS-WILL-BE-REPLACED-WITH-JS-CONTENT#$#", js);
  html = html.replace("#$#THIS-WILL-BE-REPLACED-WITH-MATRIX-RAIN#$#", matrixRain);
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

site.get("/practice", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const html = getPage("practice");
  res.send(html);
});

site.post("/api", (req, res) => {
  if (!req.body.enabledTests || !req.body.tabs) {
    res.status(400);
    res.json([{error: "Missing required fields. Both 'body.enabledTests' and 'body.tabs' are required."}]);
    return;
  }
  const runner = new TestRunner(req.body.enabledTests, req.body.tabs);
  console.log(req.body)
  runner.run();
  console.log(runner.output)
  console.log(runner.output.testOutput[0].indentTest)
  res.json(runner.output);
});

site.get("/tests", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const html = getPage("tests");
  res.send(html);
})

site.get("/javascript/:file", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  if (!fs.existsSync(`./pages/javascript/${req.params.file}`)) {
    res.send("No such js file found");
    return;
  }
  const js = fs.readFileSync(`./pages/javascript/${req.params.file}`, "utf-8");
  res.send(js);
});

site.get("/style/:file", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  if (!fs.existsSync(`./pages/style/${req.params.file}`)) {
    res.send("No such css file found");
    return;
  }
  const css = fs.readFileSync(`./pages/style/${req.params.file}`, "utf-8");
  res.send(css);
});

site.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
