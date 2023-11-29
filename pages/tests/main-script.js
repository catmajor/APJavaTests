const urlParams = new URLSearchParams(window.location.search);
const indent = urlParams.get('indent') ?? false;
const scanner = urlParams.get('scanner') ?? false;
const comment = urlParams.get('comment') ?? false;
const char = urlParams.get('char') ?? false;


if (!(indent||scanner||comment||char)) {
  alert("Please select a test");
}

const checkboxesNodeList = document.querySelectorAll(".checkbox");
const checkboxes = new Array(checkboxesNodeList.length);

function TestList () {
  this.indent = checkboxes[0];
  this.scanner = checkboxes[1];
  this.comment = checkboxes[2];
  this.char = checkboxes[3];
  this.tests = [this.indent, this.scanner, this.comment, this.char];
  console.log(indent)
  this.indent.setState(indent);
  this.scanner.setState(scanner);
  this.comment.setState(comment);
  this.char.setState(char);
}

function checkBox (boxDom, ind) {
  this.dom = boxDom;
  this.state = false;
  this.dom.addEventListener("mousedown", () => {
    this.setState(!this.state);
  });
  this.setState = (state) => {
    this.state = state;
    if (state) {
      this.dom.style.backgroundColor = "green";
    } else {
      this.dom.style.backgroundColor = "red";
    }
  }
}
checkboxesNodeList.forEach((box, ind) => {
  checkboxes[ind] = new checkBox(box, ind);
})

const testList = new TestList();
//alert(`${indent}, ${scanner}, ${comment}, ${char}`);

//Indent, scanner, comment, char