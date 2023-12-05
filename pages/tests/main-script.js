function main() {
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
        this.dom.style.backgroundColor = "#00ff00";
      } else {
        this.dom.style.backgroundColor = "#ff0000";
      }
    }
  }
  checkboxesNodeList.forEach((box, ind) => {
    checkboxes[ind] = new checkBox(box, ind);
  });
  const tabsDOM = document.getElementById("tabs");
  const tabList = [];
  const addButton = document.getElementById("add-button");
  function tab () {
    const private = {};
    private.dom = document.createElement("div");
    private.dom.classList.add("tab");
    private.wrapper = document.createElement("div");
    private.wrapper.classList.add("tab-content-wrapper");
    private.editInputWrapper = document.createElement("div");
    private.editInputWrapper.classList.add("input-wrapper");
    private.editInput = document.createElement("input");
    private.editInput.classList.add("edit-input");
    private.name = document.createElement("span");
    private.name.classList.add("name");
    private.edit = document.createElement("span");
    private.edit.classList.add("edit");
    private.delete = document.createElement("span");
    private.delete.classList.add("delete");
    private.editInputWrapper.appendChild(private.editInput);
    private.wrapper.appendChild(private.editInputWrapper);
    private.wrapper.appendChild(private.name);
    private.wrapper.appendChild(private.edit);
    private.wrapper.appendChild(private.delete);
    private.dom.appendChild(private.wrapper);
    tabsDOM.insertBefore(private.dom, addButton);
    tabList.push(this);
    private.name.textContent = "New Tab " + tabList.length;
    private.nameless = true;
    private.edit.innerHTML = '&#9998;';
    private.delete.textContent = "X";
    this.edit = () => {
      private.editInput.value = private.name.textContent;
      private.dom.classList.add("editing");
      private.editInput.focus({focusVisible: true});
    }
    this.onEdit = () => {
      private.name.textContent = private.editInput.value;
    }
    this.finishEdit = () => {
      private.name.textContent = private.editInput.value;
      private.dom.classList.remove("editing")
    }
    this.destructor = () => {
      tabsDOM.removeChild(private.dom);
      tabList.splice(tabList.indexOf(this), 1);
    }
    private.edit.addEventListener("click", this.edit);
    private.editInput.addEventListener("focusout", this.finishEdit);
    private.editInput.addEventListener("change", this.onEdit)
    private.delete.addEventListener("click", this.destructor)
  }
  addButton.addEventListener("mousedown", () => {
    new tab();
  });
  const testList = new TestList();
  setTimeout(() => {matrixRain("low")}, 2000);
}
main();
//alert(`${indent}, ${scanner}, ${comment}, ${char}`);

//Indent, scanner, comment, char