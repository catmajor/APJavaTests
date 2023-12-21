const indentTest = require("./translated/indentTest.js");
const charTest = require("./translated/charTest.js");
const scannerTest = require("./translated/scannerTest.js");
const commentTest = require("./translated/commentTest.js");

class TestRunner {
  #tabs;
  #enabledTests;
  #output = null;
  constructor (tests, tabs) {
    this.#enabledTests = {};
    Object.keys(tests).forEach(testName => {if (tests[testName]) this.#enabledTests[testName] = true;});
    this.#tabs = tabs;

  }
  run () {
    this.#output = []
    this.#tabs.forEach(tab => {
      let tabOutput = {};
      tabOutput.name = tab.name;
      let tabLines = tab.text.split("\n");
      Object.keys(this.#enabledTests).forEach(test => {
        switch (test) {
          case "indentTest":
            tabOutput.indentTest = indentTest(tabOutput.name, tabLines);
            break;
          case "scannerTest":
            tabOutput.scannerTest = scannerTest(tabOutput.name, tabLines);
            break;
          case "commentTest":
            tabOutput.commentTest = commentTest(tabOutput.name, tabLines);
            break;
          case "charTest":
            tabOutput.charTest = charTest(tabOutput.name, tabLines);
            break;
        }
      });
      this.#output.push(tabOutput);
    })
  }
  get output () {
    if (!this.#output) this.run();
    return this.#output
  }
}
module.exports = TestRunner;