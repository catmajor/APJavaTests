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
      tabOutput.name = tab[0];
      let tabLines = tab[1].split("\n");
      Object.keys(this.#enabledTests).forEach(test => {
        switch (test) {
          case "indentTest":
            tabOutput.indentTest = indentTest(tab[0], tabLines);
            break;
          case "scannerTest":
            tabOutput.scannerTest = scannerTest(tab[0], tabLines);
            break;
          case "commentTest":
            tabOutput.commentTest = commentTest(tab[0], tabLines);
            break;
          case "charTest":
            tabOutput.charTest = charTest(tab[0], tabLines);
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