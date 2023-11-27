function main () {
  const availableChars = "!\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
  function playFancyText() {
    function cycleString() {
      cycleTextArr = cycleTextArr.map(() => availableChars[Math.floor(Math.random()*availableChars.length)])
    }
    const finalText = "APJava Tests by Nikita";
    const fancyText = document.getElementById("fancy-text");
    let cycleTextArr = new Array(finalText.length).fill('-');
    fancyText.textContent = cycleTextArr.join("");
    let startInd = 0;
    let cycleCount = 0;
    setInterval(() => {
      cycleCount++;
      cycleString();
      fancyText.textContent = finalText.substring(0, startInd) + cycleTextArr.join("")
      if (cycleCount%15===0) {
        startInd++;
        cycleTextArr.shift();
      }
    }, 20)
  }
  playFancyText();
}

main()