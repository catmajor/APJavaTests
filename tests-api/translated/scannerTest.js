const TotalFails = require("../test-util.js");
function scannerTest(fileName, fileLines) {
  const fails = new TotalFails(fileName);
  let lines = [...fileLines];
  let a = "";
  let closed = false;
  let scannerLine = -1;
  for(let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    lines[lineNumber] = lines[lineNumber].replace(/[\s\t ]/g, "");
    if((lines[lineNumber].length > 7 && lines[lineNumber].substring(0, 7)==="Scanner") || (lines[lineNumber].length >12 && lines[lineNumber].substring(0,13)==="final Scanner")){
      let eqind = lines[lineNumber].indexOf("=");
      if(eqind == -1){
        eqind = lines[lineNumber].indexOf(";");
      }
      a = lines[lineNumber].substring(lines[lineNumber].indexOf("Scanner")+7, eqind);
      scannerLine = lineNumber;
      break;
    }
  }
  if(scannerLine == -1){
    fails.add(0, "Scanner not initialized");
  } else {
    for(let q = scannerLine; q<lines.length; q++){
      if(lines[q].trim().startsWith(a+".close()")){
        closed = true
      }
    } 
    if (!closed) fails.add(scannerLine, "Scanner not closed");
  }
  return fails.fails;
}

module.exports = scannerTest;

/*
@Test
public void () {

    String fileContent="";
    try {
      String[] lines = programLines;
      String a = "";
      int scannerLine = -1;
      for(int lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        lines[lineNumber] = lines[lineNumber].replaceAll("\\s", "");
        if((lines[lineNumber].length() > 7 && lines[lineNumber].substring(0, 7).equals("Scanner")) || (lines[lineNumber].length() >12 && lines[lineNumber].substring(0,12).equals("finalScanner"))){
          int eqind = lines[lineNumber].indexOf("=");
          if(eqind == -1){
            eqind = lines[lineNumber].indexOf(";");
          }
          a = lines[lineNumber].substring(lines[lineNumber].indexOf("Scanner")+7, eqind);
          scannerLine = lineNumber;
          break;
        }
      }
      if(scannerLine == -1){
        fail("Scanner not initialized");
      }
      for(int q = scannerLine; q<lines.length; q++){
        if(lines[q].trim().startsWith(a+".close()")){
          return;
        }
      }
      fail("Scanner not closed");
    } catch (Exception e) {
      fail("Problem Finding Instructor.java " + e);
    }
}
*/