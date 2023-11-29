const urlParams = new URLSearchParams(window.location.search);
const indent = urlParams.get('indent') ?? false;
const scanner = urlParams.get('scanner') ?? false;
const comment = urlParams.get('comment') ?? false;
const char = urlParams.get('char') ?? false;


if (!(indent||scanner||comment||char)) {
  alert("Please select a test");
}
alert(`${indent}, ${scanner}, ${comment}, ${char}`);

//Indent, scanner, comment, char