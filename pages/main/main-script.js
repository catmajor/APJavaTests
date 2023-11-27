function main () {
  function playFancyText() {
    const availableChars = "!\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
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
      if (cycleCount%10===0) {
        startInd++;
        cycleTextArr.shift();
      }
    }, 20)
  }
  function matrixRain() {
    const availableChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789"
    function RainDrop() {
      if (this===window) throw "RainDrop must be called as a constructor";
      function Droplet() {
        if (this===window) throw "Droplet must be called as a constructor";
        
      }
      let private = {};
      private.top = 0;
      private.size = Math.floor(Math.random()*20+20)
      private.speed = Math.floor(Math.random()*10+10);
      private.switchInterval = Math.floor(Math.random()*4+8);
      private.frameCount = 0;
      this.chars = new Array();
      this.dom = document.createElement("div");
      document.body.appendChild(this.dom);
      this.dom.classList.add("matrix-rain");
      this.dom.textContent = availableChars[Math.floor(Math.random()*availableChars.length)]
      this.setTop = (px) => {
        this.dom.style.top = `${px}px`;
        private.top = px;
      }
      this.destructor = () => {
        this.body.removeChild(this.dom);
      }
      this.callAction = () => {
        this.setTop(private.top+private.speed);
        private.frameCount++;
        if (private.frameCount%private.switchInterval===0) {
          this.dom.textContent = availableChars[Math.floor(Math.random()*availableChars.length)]
        }
        if (private.top + private.size >= window.innerHeight) {
          this.destructor();
        }
      }
    }
    const rainDropArr = [];
    rainDropArr.push(new RainDrop());
    setInterval(() => {
      rainDropArr.forEach((drop) => {
        drop.callAction();
      })
    }, 100)
  }
  playFancyText();
  matrixRain();
}

main()