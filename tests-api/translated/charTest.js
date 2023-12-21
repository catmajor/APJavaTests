const TotalFails = require("../test-util.js");
function charTest(fileName, fileLines) {
  const fails = new TotalFails(fileName);
  for (let lineNumber = 1; lineNumber <= fileLines.length; lineNumber++) {
      let line = fileLines[lineNumber - 1];
      if (line.length > 80) {
          fails.add(lineNumber, "Too many characters (over 80)");
      }
  }
  return fails.fails;
}

module.exports = charTest;

/*
@Test
public void () {

  try {
        String[] lines = programLines;
        ArrayList<Integer> failLines = new ArrayList<Integer>();
        for (int lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            String line = lines[lineNumber];
            if (line.length() > 80) {
                failLines.add(lineNumber + 1);
            }
        }
        if (failLines.size()!=0) {
          String failText = "\n\u001b[31mExceeds 80 chars\nIn " + (main_javaIsMain?"Main.java":"MyShape.java") + " at lines:";
          boolean inMain = true;
          for (Integer failNum:failLines) {
            if (failNum>programBreakPoint) {
              if (inMain) failText += "\nIn RoundThings.java at lines:";
              inMain = false;
            }
            failText += (" " + (!inMain?failNum-programBreakPoint:failNum) + ",");
          }
          failText = failText.substring(0, failText.length()-1);
          failText +="\n----------------\u001b[0m";
          fail(failText);
        }
    } catch (Exception e) {
        fail("Problem reading the file: " + e.getMessage());
    }
}
*/