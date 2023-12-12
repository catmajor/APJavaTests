@Test
public void () {

    // Enter code here
    Path filePath = main_javaIsMain?Paths.get("Main.java"):Paths.get("MyShape.java");
    String fileContent="";
    try {
      fileContent = Files.readString(filePath);
    } catch (Exception e) {
      fail("Problem Finding Instructor.java " + e);
    }

    fileContent = fileContent.replaceAll("\\s+","");
    assertTrue(fileContent.contains("//"));
}