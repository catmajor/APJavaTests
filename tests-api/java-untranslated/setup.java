// Add initialization code here
private final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
private final PrintStream originalOut = System.out;
private final InputStream originalIn = System.in;
private ByteArrayInputStream inputStream; 
private boolean main_javaIsMain = false;
private String mainClass = "null";
private Method runnerMethod = null;
private String[] programLines;
private int programBreakPoint;
private ConventionEnum conventionUsed = ConventionEnum.NONE;
public _test_runnerTestSuite () {
  try {
    File runner = new File("_IOTest_Runner.java");
    File mainJava = new File("Main.java");
    Path mainFilePath;
    if (mainJava.exists()&&!mainJava.isDirectory()) {
      mainFilePath = Paths.get("Main.java");
      main_javaIsMain = true;
    }
    else mainFilePath = Paths.get("MyShape.java");
    String sumProgramContent="";
    sumProgramContent += Files.readString(mainFilePath) + "\r\n";
    programBreakPoint = sumProgramContent.split("\\r?\\n").length;
    programLines = sumProgramContent.split("\\r?\\n");
    boolean inMulti = false;
    for (String line:programLines) {
      if (line.contains("*/")) {
        inMulti = false;
        continue;
      }
      if (line.contains("/")) {
        inMulti = true;
        continue;
      }
      if (line.trim().startsWith("//")) continue;
      if (line.contains("class")) {
        Pattern matchClassMain = Pattern.compile("class(.*)Main");
        Pattern matchClassMyShape = Pattern.compile("class(.*)MyShape");
        if (matchClassMain.matcher(line).find()) mainClass = "Main";
        else if (matchClassMyShape.matcher(line).find()) mainClass = "MyShape";
      }
    }
    if (mainClass.equals("null")) fail("\u001B[31m\nMain method in Main.java or MyShape.java not found. \nIf class improperly named, rename class to either Main.java or MyShape.java to continue\u001B[0m");
    runner.createNewFile();
    FileWriter writer = new FileWriter("_IOTest_Runner.java");
    writer.write(
      "//runner file created by unit tests, ignore for grading purposes please"+
      " Mrs. Hertle\n//If you're a student ignore this, TAs need to test their code " + 
      "too\npublic class _IOTest_Runner{public static void main() {" + 
      "String[] args = new String[0];"
      + mainClass + ".main(args);}}"
    );
    writer.close();
    JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
    DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
    StandardJavaFileManager fileManager = compiler.getStandardFileManager(diagnostics, null, null);
    Iterable<? extends JavaFileObject> compilationUnits = fileManager.getJavaFileObjectsFromFiles(Arrays.asList(runner));
    JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, diagnostics, null, null, compilationUnits);
    task.call();
    Class<?> runnerClass = Class.forName("_IOTest_Runner");
    runnerMethod = runnerClass.getMethod("main");
    runner.delete();
  } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
  }
}
private String testOutput(String input) {
  outputStream.reset();
  inputStream = new ByteArrayInputStream(input.getBytes());
  System.setIn(inputStream);
  try {
    runnerMethod.invoke(null);
  } catch (Exception e) {

  }
  String output = outputStream.toString().trim();
  return output;
}
private String outputCorrect(TestCase testCase, String output) {
  Pattern number = Pattern.compile("[0-9]+");
  String [] lines = output.split("\n");
  int [] studentRandNums = new int[6];
  int [] randArr = testCase.nums;
  int correctPrize = 0;
  for(int k = 0; k<lines.length; k++){
    if(lines[k].contains("win")){
      Matcher numMatcher = number.matcher(lines[k+1]);
      int num = 0;
      while (numMatcher.find()) {
        studentRandNums[num] = Integer.parseInt(numMatcher.group());
        num++;
      }
    }
    throw new RuntimeException(""+studentRandNums[4]);
  }

  String lastLine = lines[lines.length-1];
  int studentPrize = 0;
  Matcher prizeMatch = number.matcher(lastLine);
  if(prizeMatch.find()){
    studentPrize = Integer.parseInt(prizeMatch.group());
  }
  for(int i = 0; i<5; i++){
    if(randArr[i]==studentRandNums[i]){
      correctPrize+=50;
    }
  }
  if(randArr[5]==studentRandNums[5]){
    correctPrize+=500;
  }
  if(correctPrize == studentPrize){
    return("passed");
  }
  else{
    throw new RuntimeException(output+studentRandNums.length);
  }
}
public TestCase randomTest () {
  int[] nums = new int[6];
  for (int i = 0; i<5; i++) {
    nums[i] = (int)(Math.random()*59+1);
  }
  nums[5] = (int)(Math.random()*39+1);
  return new TestCase(nums);
}
public String randomString (int length) {
  String available = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";
  String returnStr = "";
  for (int i = 0; i<length; i++) {
    int random = (int) (Math.random()*63);
    returnStr += available.substring(random, random+1);
  }
  return returnStr;
}
public void silentFail(StringReference reference, String failText) {
  reference.add(failText + "\n");
  reference.add("--------\n");
}
class TestCase {
  public int[] nums = new int[6];
  public TestCase () {
  }
  public TestCase (int[] nums_) {
    nums = nums_;
  }
  public String getInput () {
    String input = "";
    for (int i = 0; i<6; i++) {
      input += nums[i] + "\n";
    }
    return input;
  }
}
class StringReference {
  public String value = "";
  public StringReference (String string) {
    value = string;
  }
  public void set (String string) {
    value = string;
  }
  public void add (String string) {
    value += string;
  }
  public String toString() {
    return value;
  }
}
public enum ConventionEnum {
  NONE, WITH_INDENT, WITH_PARENTH
}
