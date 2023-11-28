function main () {
  function playFancyText() {
    const availableChars = "!\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    function cycleString() {
      cycleTextArr.forEach((ele) => ele.textContent = availableChars[Math.floor(Math.random()*availableChars.length)])
    }
    const finalText = "APJava Tests by Nikita";
    const fancyText = document.getElementById("fancy-text");
    let tempTextArr = new Array(finalText.length).fill('-');
    fancyText.innerHTML = tempTextArr.reduce((acc, ele, ind) => {
      return acc += `<span id="fancy-text-${ind}">-</span>`;
    }, "");
    tempTextArr = document.querySelectorAll("#fancy-text>span");
    let cycleTextArr = new Array(finalText.length);
    tempTextArr.forEach((ele, ind) => cycleTextArr[ind] = ele);
    let startInd = 0;
    let cycleCount = 0;
    const cycleInterval = setInterval(() => {
      cycleCount++;
      cycleString();
      if (cycleCount%10===0) {
        cycleTextArr[0].textContent = finalText[startInd];
        startInd++;
        cycleTextArr.shift();
        if (startInd > finalText.length - 1) clearInterval(cycleInterval);
      }
    }, 20)
  }
  function matrixRain() {
    const dom = document.createElement("div");
    dom.setAttribute("id", "matrix-rain");
    document.body.appendChild(dom);
    const availableChars = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ012345789Z:・.\"=*+-<>¦çﾘｸ"
    function RainDrop(_startFrame) {
      let rainDrop = this
      if (this===window) throw "RainDrop must be called as a constructor";
      function Droplet(parent) {
        if (this===window) throw "Droplet must be called as a constructor";
        private.dropletArr.push(this);
        this.dom = document.createElement("div");
        this.text = document.createElement("p");
        this.dom.classList.add("matrix-rain-droplet");
        parent.dom.appendChild(this.dom);
        this.dom.appendChild(this.text);
        this.dom.style.top = `${private.top}px`;
        this.dom.style.left = `${private.left}px`;
        this.text.textContent = parent.text.textContent;
        this.dom.style.fontSize = private.size;
        this.dom.style.animationDuration = `${private.fadeSpeed}s`
        this.potentialSwitchTimeout = null;
        this.potentialSwitch = () => {
          this.potentialSwitchTimeout = setTimeout(()=>{
            if (Math.floor(Math.random()*4)===0) {
              this.text.textContent = availableChars[Math.floor(Math.random()*availableChars.length)];
            }
            this.potentialSwitch();
          }, 1000); 
        }
        this.potentialSwitch();
        setTimeout(() => {
          clearTimeout(this.potentialSwitchTimeout);
          parent.dom.removeChild(this.dom);
          this.text = null;
          this.dom = null;
        }, private.fadeSpeed*1000)
      }
      let private = {};
      private.size = Math.floor(Math.random()*20+20);
      private.top = -2*private.size;
      private.left = Math.floor(Math.random()*window.innerWidth);
      private.speed = Math.floor(Math.random()*10+10);
      private.fadeSpeed = Math.floor(Math.random()*5+5)
      private.framePrintInterval = Math.floor(private.size/private.speed);
      private.switchInterval = Math.floor(Math.random()*4+8);
      private.startFrame = _startFrame;
      private.dropletArr = [];
      this.chars = new Array();
      this.dom = document.createElement("div");
      this.dom.style.top = `${private.top}px`;
      this.dom.style.left = `${private.left}px`;
      this.text = document.createElement("p");
      this.dom.appendChild(this.text);
      this.dom.style.fontSize = `${private.size}px`;
      dom.appendChild(this.dom);
      this.dom.classList.add("matrix-rain-rainDrop");
      this.text.textContent = availableChars[Math.floor(Math.random()*availableChars.length)]
      this.setTop = (px) => {
        this.dom.style.top = `${px}px`;
        private.top = px;
      }
      this.destructor = () => {
        rainDropArr.splice(rainDropArr.indexOf(this), 1);
        setTimeout(() => {
          dom.removeChild(this.dom);
          rainDrop = null;
          this.text = null;
          this.dom = null;
          private.dropletArr = null;
        }, private.fadeSpeed*1000)
      }
      this.callAction = (frame) => {
        this.setTop(private.top+private.speed);
        let frameSinceCreation = private.startFrame-frame;
        if ((frameSinceCreation)%private.framePrintInterval===0) {
          this.text.textContent = availableChars[Math.floor(Math.random()*availableChars.length)];
          private.dropletArr.push(new Droplet(this));
        }
        if (private.top + private.size >= window.innerHeight) {
          this.destructor();
        }
      }
    }
    const rainDropArr = [];
    frame = 0;
    setInterval(() => {
      rainDropArr.forEach((drop) => {
        drop.callAction(frame);
      })
      if (Math.floor(Math.random()*(rainDropArr.length))===0) {
        rainDropArr.push(new RainDrop(frame))
      }
      frame++;
    }, 100)
  }
  playFancyText();
  matrixRain();
}

main()