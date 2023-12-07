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
  const textAreaWrapper = document.getElementById("text-area");
  const textArea = document.getElementById("input");
  const lineNumber = document.getElementById("lines");
  const tabList = [];
  let selectedTab = null;
  const addButton = document.getElementById("add-button");
  function updateTabs () {
    const simpleTabArr = tabList.map(ele => ele.simplify());
    localStorage.setItem("tabs", JSON.stringify(simpleTabArr));
  }
  function createTabs () {
    let tabs = JSON.parse(localStorage.getItem("tabs"));
    console.log(tabs)
    if (tabs&&tabs?.length!==0) {
      tabs.forEach((tabEle) => {
        new tab(tabEle[0], tabEle[1]);
      });
    }
    if (tabList.length===0) {
      new tab();
    }
    tabList[0].select();
  }
  createTabs();
  function tab (name = null, textAreaContent = null) {
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
    private.name.textContent = name ?? "Main" + (tabList.length===1?"":(tabList.length-1)) + ".java";
    private.nameless = true;
    private.edit.innerHTML = '&#9998;';
    private.delete.textContent = "X";
    this.textAreaContent = textAreaContent ?? "Code Here";
    this.edit = (e) => {
      e.stopPropagation()
      private.editInput.value = private.name.textContent;
      private.dom.classList.add("editing");
      private.editInput.focus({focusVisible: true});
    }
    this.onEdit = () => {
      private.name.textContent = private.editInput.value;
    }
    this.finishEdit = () => {
      let javaIndex = private.editInput.value.indexOf(".java")
      private.name.textContent = private.editInput.value.substring(0, javaIndex!==-1?javaIndex:private.editInput.value.length) + ".java";
      private.dom.classList.remove("editing");
      updateTabs();
    }
    this.destructor = (e) => {
      e?.stopPropagation()
      tabsDOM.removeChild(private.dom);
      let index = tabList.indexOf(this);
      tabList.splice(index, 1);
      if (tabList.length === 0) {
        new tab();
      } else {
        tabList[index].select();
      }
      updateTabs();
    }
    this.simplify = () => {
      const values = [private.name.textContent, this.textAreaContent];
      return values;
    }
    this.select = () => {
      selectedTab?.unselect();
      selectedTab = this;
      private.dom.classList.add("selected");
      textArea.innerText = this.textAreaContent;
      setLines(analyzeText(textArea.innerText));
    }
    this.unselect = () => {
      private.dom.classList.remove("selected");
    }
    private.dom.addEventListener("click", this.select)
    private.edit.addEventListener("click", this.edit);
    private.editInput.addEventListener("focusout", this.finishEdit);
    private.editInput.addEventListener("change", this.onEdit);
    private.delete.addEventListener("click", this.destructor);
    updateTabs();
  }
  addButton.addEventListener("mousedown", () => {
    new tab();
    tabList[tabList.length-1].select();
  });
  function analyzeText (text) {
    let height = textArea.offsetHeight/16
    return  height;
  }
  function setLines (number) {
    console.log(number)
    let string = "";
    for (let i = 1; i<=number; i++) {
      string += i + "<br>";
    }
    lineNumber.innerHTML = string;
  }
  let changeTimeout = null;
  textAreaWrapper.addEventListener("click", () => textArea.focus());
  textArea.addEventListener("focus", ()=> {
    textAreaWrapper.classList.add("focused");
  });
  textArea.addEventListener("focusout", ()=> {
    textAreaWrapper.classList.remove("focused");
  });
  textArea.addEventListener("input", ()=>{
    if (changeTimeout) {
      clearTimeout(changeTimeout);
    }
    changeTimeout = setTimeout(()=>{
      try {
        setLines(analyzeText(textArea.innerText));
        selectedTab.textAreaContent = textArea.innerText;
        updateTabs();
      } catch (e) {console.log(e)}
    }, 50); 
  });
  const testOutput = document.getElementById("test-output");
  let testOutputOpen = false;
  testOutput.addEventListener("click", ()=> {
    if (testOutputOpen) {
      closeTestOutput();
    } else {
      openTestOutput();
    }
    testOutputOpen = !testOutputOpen;
  })
  const testList = new TestList();
  setTimeout(() => {matrixRain("low")}, 2000);
}
main();
//alert(`${indent}, ${scanner}, ${comment}, ${char}`);

//Indent, scanner, comment, char