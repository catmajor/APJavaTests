const TotalFails = require("../test-util.js")

let conventionUsedEnum =  {
  NONE: 0,
  WITH_INDENT: 1,
  WITH_PARENTH: 2,
}

function indentTest(fileName, fileLines) {
  const fails = new TotalFails(fileName);
  let inMultilineComment = false;
  let braketInd = 0;
  let braceCount = 0;
  let parenthOpen = false;
  let lineNum = 0;
  let conventionUsed = conventionUsedEnum.NONE;
  let prevEndsWithSemicolon = true;
  for (line of fileLines) {
    lineNum++;
    if (line.trim().length == 0) continue;
    line = line.replace("\t", "    ");
    let trimLine = line.trim();
    let actualSpaces = 0;
    for (; actualSpaces < line.length; actualSpaces++) {
      if (line.charAt(actualSpaces)!=' ') break;
    }
    if (trimLine.includes("/*")) inMultilineComment = true;
    if (inMultilineComment) {
      if (actualSpaces!=braceCount*4
          &&
          !parenthOpen
         ) {
        fails.add(lineNum, "Indent for multiline comment incorrect");
      }
      else if (parenthOpen) {
          switch(conventionUsed) {
            case conventionUsedEnum.NONE:
              if (actualSpaces == braceCount*4+4) {
                conventionUsed = ConventionEnum.WITH_INDENT;
                break;
              } else if (actualSpaces == braketInd + 1) {
                conventionUsed = ConventionEnum.WITH_PARENTH;
                break;
              }
            case conventionUsedEnum.WITH_INDENT:
              if (actualSpaces == braceCount*4+4) {
              break;
              } else if (actualSpaces == braketInd + 1) {
                fails.add(lineNum, "Check indent for multiline comment, MAY not follow previous convention found in file", {warning: true});
                break;
              }
            case conventionUsedEnum.WITH_PARENTH:
              if (actualSpaces == braketInd + 1) {
                conventionUsed = ConventionEnum.WITH_PARENTH;
                break;
              } else if (actualSpaces == braceCount*4+4) {
                fails.add(lineNum, "Check indent for multiline comment, MAY not follow previous convention found in file", {warning: true});
                break;
              }
              fails.add(lineNum, "Indent for multiline comment incorrect");
              break;
          }
        }
      if (trimLine.includes("*/")) inMultilineComment = false;
      continue;
    }
    if (line.includes("{")&&line.includes("}")&&(line.indexOf("{")<line.indexOf("}"))) {
      //fail for too many brackets on one line
      fails.add(lineNum, "Should not contain an opener and closer bracket");
    }
    if (line.includes("}")) braceCount--;
    let expectedSpaces = braceCount*4;
    if (actualSpaces != expectedSpaces + (prevEndsWithSemicolon?0:4)) {
      //all of this can probably be combined into one big logic statement
      //but like why.
      if (parenthOpen&&(conventionUsed==conventionUsedEnum.NONE||conventionUsed==conventionUsedEnum.WITH_PARENTH||trimLine.charAt(0)!=')')) {
        switch(conventionUsed) {
          case conventionUsedEnum.NONE:
            if (actualSpaces == braceCount*4+4) {
              conventionUsed = conventionUsedEnum.WITH_INDENT;
              break;
            } else if (actualSpaces == braketInd + 1) {
              conventionUsed = conventionUsedEnum.WITH_PARENTH;
              break;
            }
          case conventionUsedEnum.WITH_INDENT:
            if (actualSpaces == braceCount*4+4) {
            break;
            } else if (
              actualSpaces == braketInd + 1
              ||
              (trimLine.charAt(0)==')'&&actualSpaces==braketInd)
            ) {
              fails.add(lineNum, "Check indent inside paranthesis MAY not follow convention found previously in file", {warning: true});
              break;
            }
          case conventionUsedEnum.WITH_PARENTH:
            if (
                (actualSpaces == braketInd + 1)
                ||
                (trimLine.charAt(0)==')'&&actualSpaces==braketInd)
               ) {
              conventionUsed = conventionUsedEnum.WITH_PARENTH;
              break;
            } else if (actualSpaces == braceCount*4+4) {
              fails.add(lineNum, "Check indent inside paranthesis MAY not follow convention found previously in file", {warning: true});
              break;
            }
            fails.add(lineNum, "Indent inside paranthesis incorrect");
        } 	
      } else if (trimLine.charAt(0)==')'&&actualSpaces==braketInd) {
        //pass case for closing paranthesis
      } else {
        fails.add(lineNum, "Incorrect indent");
        //fail case for incorrect indent
      }
    }

    if (line.includes("{")) braceCount++;
    if (line.indexOf('(')!=-1||line.indexOf(')')!=-1) {
      let slashCount = 0;
      let parenthCounter = 0;
      let inQuotation = false;
      for (let charNum = 0; charNum<line.length; charNum++) {
        let charAtInd = line.charAt(charNum);
        if (charAtInd == '"') inQuotation=!inQuotation;
        if (inQuotation) continue;
        if (charAtInd == '/') slashCount++;
        else slashCount = 0;
        if (slashCount == 2) break;
        if (charAtInd == '(') {
          braketInd = charNum;
          parenthCounter++;
        }
        if (charAtInd == ')') {
          parenthCounter--;
          if (parenthCounter == 0) {
            braketInd = 0;
          }
        }
      }
      if (parenthCounter>1) {
        parenthOpen = true;
        fails.add(lineNum, "Should not leave more than 1 parenthese left open");
        //fail case, too many open parenthesis	
      }
      if (parenthCounter==1) {
        if (parenthOpen) {
          fails.add(lineNum, "Should not contain nested parenthesis");
          //fail case -- should not have multiple nested multi-line
          //parenthesis blocks
      } else parenthOpen = true;
    }
    if (parenthCounter<=0) parenthOpen = false;
    }
    let trimLineCommentStripped = trimLine;
    if (trimLineCommentStripped.includes("//")&&!trimLineCommentStripped.startsWith("//")) {
      let slashCounter = 0;
      let quoteOpen = false;
      for (let charInd = 0; charInd < trimLineCommentStripped.length; charInd++) {
        if (trimLineCommentStripped.charAt(charInd)=='"') quoteOpen = !quoteOpen;
        if (quoteOpen) continue;
        if (trimLineCommentStripped.charAt(charInd)=='/') slashCounter++;
        else slashCounter = 0;
        if (slashCounter == 2) {
          trimLineCommentStripped = trimLineCommentStripped.substring(0, charInd-1).trim();
        }
      }
    }
    if (
      trimLine.charAt(trimLineCommentStripped.length-1)!=';'
      &&
      trimLine.charAt(trimLine.length-1)!='{'
      &&
      trimLine.charAt(trimLine.length-1)!='}'
      &&
      !parenthOpen
      &&
      !inMultilineComment
      &&
      !trimLine.startsWith("//")
      &&
      !fileLines[lineNum]?.trim().startsWith("{")
    ) {
      prevEndsWithSemicolon = false;
    } else {
      prevEndsWithSemicolon = true;
    }
  }
  return fails.fails;
}

module.exports = indentTest;

/*
Test
public void () {

    StringReference failText = new StringReference("\n\033[0;31mFails at one or more lines:\n----------------\n");
    boolean fails = false;
    try {
      String[] lines = programLines;
      boolean inMultilineComment = false;
      int braketInd = 0;
      int braceCount = 0;
      boolean parenthOpen = false;
      int lineNum = 0;
      boolean prevEndsWithSemicolon = true;
      for (String line:lines) {
        lineNum++;
        if (line.trim().length() == 0) continue;
        line = line.replace("\t", "    ");
        String trimLine = line.trim();
        int actualSpaces = 0;
        for (; actualSpaces < line.length(); actualSpaces++) {
          if (line.charAt(actualSpaces)!=' ') break;
        }
        if (trimLine.contains("/*")) inMultilineComment = true;
        if (inMultilineComment) {
          if (actualSpaces!=braceCount*4
              &&
              !parenthOpen
             ) {
            silentFail(failText, "Indent for multiline comment incorrect at line " + lineNum + " in file " + fileName);
            fails = true;
          }
          else if (parenthOpen) {
              switch(conventionUsed) {
                case NONE:
                  if (actualSpaces == braceCount*4+4) {
                    conventionUsed = ConventionEnum.WITH_INDENT;
                    break;
                  } else if (actualSpaces == braketInd + 1) {
                    conventionUsed = ConventionEnum.WITH_PARENTH;
                    break;
                  }
                case WITH_INDENT:
                  if (actualSpaces == braceCount*4+4) {
                  break;
                  } else if (actualSpaces == braketInd + 1) {
                    silentFail(failText, "\u001b[0m\u001b[33mCheck indent for multiline comment, MAY not follow previous convention found in file at line " + lineNum + " in file " + fileName+"\u001b[0m\u001b[31m");
                    fails = true;
                    break;
                  }
                case WITH_PARENTH:
                  if (actualSpaces == braketInd + 1) {
                    conventionUsed = ConventionEnum.WITH_PARENTH;
                    break;
                  } else if (actualSpaces == braceCount*4+4) {
                    silentFail(failText, "\u001b[0m\u001b[33mCheck indent for multiline comment, MAY not follow previous convention found in file at line " + lineNum + " in file " + fileName+"\u001b[0m\u001b[31m");
                    fails = true;
                    break;
                  }
                  silentFail(failText, "Indent for multiline comment incorrect at line " + lineNum + " in file " + fileName);
                  fails = true;
                  break;
              }
            }
          if (trimLine.contains("REMEMBER TO INSERT MULTILINE CLOSER HERE")) inMultilineComment = false;
          continue;
        }
        if (line.contains("{")&&line.contains("}")) {
          //fail for too many brackets on one line
          fails = true;
          silentFail(failText, "Should not contain an opener and closer bracket at line " + lineNum + " in file " + fileName);
        }
        if (line.contains("}")) braceCount--;
        int expectedSpaces = braceCount*4;
        if (actualSpaces != expectedSpaces + (prevEndsWithSemicolon?0:4)) {
          //all of this can probably be combined into one big logic statement
          //but like why.
          if (parenthOpen&&(conventionUsed==ConventionEnum.NONE||conventionUsed==ConventionEnum.WITH_PARENTH||trimLine.charAt(0)!=')')) {
            switch(conventionUsed) {
              case NONE:
                if (actualSpaces == braceCount*4+4) {
                  conventionUsed = ConventionEnum.WITH_INDENT;
                  break;
                } else if (actualSpaces == braketInd + 1) {
                  conventionUsed = ConventionEnum.WITH_PARENTH;
                  break;
                }
              case WITH_INDENT:
                if (actualSpaces == braceCount*4+4) {
                break;
                } else if (
                  actualSpaces == braketInd + 1
                  ||
                  (trimLine.charAt(0)==')'&&actualSpaces==braketInd)
                ) {
                  silentFail(failText, "\u001b[0m\u001b[33mCheck indent inside paranthesis MAY not follow convention found previously in file at line " + lineNum + " in file " + fileName+"\u001b[0m\u001b[31m");
                  fails = true;
                  break;
                }
              case WITH_PARENTH:
                if (
                    (actualSpaces == braketInd + 1)
                    ||
                    (trimLine.charAt(0)==')'&&actualSpaces==braketInd)
                   ) {
                  conventionUsed = ConventionEnum.WITH_PARENTH;
                  break;
                } else if (actualSpaces == braceCount*4+4) {
                  silentFail(failText, "\u001b[0m\u001b[33mCheck indent inside paranthesis MAY not follow convention found previously in file at line " + lineNum + " in file " + fileName+"\u001b[0m\u001b[31m");
                  fails = true;
                  break;
                }
                silentFail(failText, "Indent inside paranthesis incorrect at line " + lineNum + " in file " + fileName);
                fails = true;
            } 	
          } else {
            fails = true;
            silentFail(failText, "Incorrect indent at line " + lineNum + " in file " + fileName);
            //fail case for incorrect indent
          }
        }

        if (line.contains("{")) braceCount++;
        if (line.indexOf('(')!=-1||line.indexOf(')')!=-1) {
          int slashCount = 0;
          int parenthCounter = 0;
          boolean inQuotation = false;
          for (int charNum = 0; charNum<line.length(); charNum++) {
            char charAtInd = line.charAt(charNum);
            if (charAtInd == '"') inQuotation=!inQuotation;
            if (inQuotation) continue;
            if (charAtInd == '/') slashCount++;
            else slashCount = 0;
            if (slashCount == 2) break;
            if (charAtInd == '(') {
              braketInd = charNum;
              parenthCounter++;
            }
            if (charAtInd == ')') {
              parenthCounter--;
              if (parenthCounter == 0) {
                braketInd = 0;
              }
            }
          }
          if (parenthCounter>1) {
            parenthOpen = true;
            fails = true;
            silentFail(failText, "Should not leave more than 1 parenthese left open at line " + (lineNum>programBreakPoint?(lineNum-programBreakPoint+1) + " in file " + fileName);
            //fail case, too many open parenthesis	
          }
          if (parenthCounter==1) {
            if (parenthOpen) {
              silentFail(failText, "Should not contain nested parenthesis at line " + (lineNum>programBreakPoint?(lineNum-programBreakPoint+1) + " in file " + fileName);
              //fail case -- should not have multiple nested multi-line
              //parenthesis blocks
          } else parenthOpen = true;
        }
        if (parenthCounter<=0) parenthOpen = false;
        }
        String trimLineCommentStripped = trimLine;
        if (trimLineCommentStripped.contains("//")&&!trimLineCommentStripped.startsWith("//")) {
          int slashCounter = 0;
          boolean quoteOpen = false;
          for (int charInd = 0; charInd < trimLineCommentStripped.length(); charInd++) {
            if (trimLineCommentStripped.charAt(charInd)=='"') quoteOpen = !quoteOpen;
            if (quoteOpen) continue;
            if (trimLineCommentStripped.charAt(charInd)=='/') slashCounter++;
            else slashCounter = 0;
            if (slashCounter == 2) {
              trimLineCommentStripped = trimLineCommentStripped.substring(0, charInd-1).trim();
            }
          }
        }
        if (
          trimLine.charAt(trimLineCommentStripped.length()-1)!=';'
          &&
          trimLine.charAt(trimLine.length()-1)!='{'
          &&
          trimLine.charAt(trimLine.length()-1)!='}'
          &&
          !parenthOpen
          &&
          !inMultilineComment
          &&
          !trimLine.startsWith("//")
          &&
          !lines[lineNum].trim().startsWith("{")
        ) {
          prevEndsWithSemicolon = false;
        } else {
          prevEndsWithSemicolon = true;
        }
      }
    } catch (Exception e) {
      fails = true;
      silentFail(failText, "Unexpected fail: " + e.getMessage());
    }
    if (fails) {
      failText.value = failText.value.substring(0, failText.value.length()-1);
      failText.add("--------\033[0m");
      fail(failText.toString());
    }

}
*/