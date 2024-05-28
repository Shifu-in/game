console.clear();

class Stage {
  // (Rest of the Stage class remains unchanged)
}

class Block {
  // (Rest of the Block class remains unchanged)
}

class Game {
  constructor() {
    this.stage = new Stage();
    this.mainContainer = document.getElementById('container');
    this.scoreContainer = document.getElementById('score');
    this.startButton = document.getElementById('start-button');
    this.instructions = document.getElementById('instructions');
    this.scoreContainer.innerHTML = '0';
    this.newBlocks = new THREE.Group();
    this.placedBlocks = new THREE.Group();
    this.choppedBlocks = new THREE.Group();
    this.stage.add(this.newBlocks);
    this.stage.add(this.placedBlocks);
    this.stage.add(this.choppedBlocks);
    this.addBlock();
    this.tick();
    this.updateState(this.STATES.READY);
    this.leaderboard = [];
    this.startTime = null;
    this.rewardInterval = 2 * 60 * 1000; // 2 minutes
    this.rewardPoints = 1000;

    document.addEventListener('keydown', e => {
      if (e.keyCode === 32) this.onAction();
    });

    document.addEventListener('click', () => {
      this.onAction();
    });

    document.getElementById('leaderboard').addEventListener('click', () => {
      alert("Leaderboard:\n" + this.leaderboard.join("\n"));
    });

    document.getElementById('faq').addEventListener('click', () => {
      alert("FAQ:\n\n" +
        "1. The objective of the game is to stack blocks as high as possible.\n" +
        "2. Click or press the spacebar to place the block.\n" +
        "3. You earn 1000 points for every 2 minutes actively spent in the game.\n" +
        "4. The points can be exchanged for cryptocurrency in the future.");
    });
  }

  updateState(newState) {
    for (let key in this.STATES) this.mainContainer.classList.remove(this.STATES[key]);
    this.mainContainer.classList.add(newState);
    this.state = newState;
  }

  onAction() {
    switch (this.state) {
      case this.STATES.READY:
        this.startGame();
        break;
      case this.STATES.PLAYING:
        this.placeBlock();
        break;
      case this.STATES.ENDED:
        this.restartGame();
        break;
    }
  }

  startGame() {
    if (this.state !== this.STATES.PLAYING) {
      this.scoreContainer.innerHTML = '0';
      this.updateState(this.STATES.PLAYING);
      this.addBlock();
      this.startTime = new Date();
      this.checkReward();
    }
  }

  checkReward() {
    if (this.state === this.STATES.PLAYING) {
      const currentTime = new Date();
      if (currentTime - this.startTime >= this.rewardInterval) {
        this.addPoints(this.rewardPoints);
        this.startTime = new Date(); // Reset the timer
      }
      setTimeout(() => this.checkReward(), 1000);
    }
  }

  addPoints(points) {
    this.scoreContainer.innerHTML = String(parseInt(this.scoreContainer.innerHTML) + points);
  }

  restartGame() {
    this.updateState(this.STATES.RESETTING);
    let oldBlocks = this.placedBlocks.children;
    let removeSpeed = 0.2;
    let delayAmount = 0.02;
    for (let i = 0; i < oldBlocks.length; i++) {
      gsap.to(oldBlocks[i].scale, {
        duration: removeSpeed,
        x: 0,
        y: 0,
        z: 0,
        delay: (oldBlocks.length - i) * delayAmount,
        ease: "power1.in",
        onComplete: () => this.placedBlocks.remove(oldBlocks[i])
      });
      gsap.to(oldBlocks[i].rotation, {
        duration: removeSpeed,
        y: 0.5,
        delay: (oldBlocks.length - i) * delayAmount,
        ease: "power1.in"
      });
    }
    let cameraMoveSpeed = removeSpeed * 2 + (oldBlocks.length * delayAmount);
    this.stage.setCamera(2, cameraMoveSpeed);
    let countdown = { value: this.blocks.length - 1 };
    gsap.to(countdown, {
      duration: cameraMoveSpeed,
      value: 0,
      onUpdate: () => { this.scoreContainer.innerHTML = String(Math.round(countdown.value)); }
    });
    this.blocks = this.blocks.slice(0, 1);
    setTimeout(() => {
      this.startGame();
    }, cameraMoveSpeed * 1000);
  }

  placeBlock() {
    let currentBlock = this.blocks[this.blocks.length - 1];
    let newBlocks = currentBlock.place();
    this.newBlocks.remove(currentBlock.mesh);
    if (newBlocks.placed) this.placedBlocks.add(newBlocks.placed);
    if (newBlocks.chopped) {
      this.choppedBlocks.add(newBlocks.chopped);
      let positionParams = { y: '-=30', ease: "power1.in", onComplete: () => this.choppedBlocks.remove(newBlocks.chopped) };
      let rotateRandomness = 10;
      let rotationParams = {
        delay: 0.05,
        x: newBlocks.plane === 'z' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
        z: newBlocks.plane === 'x' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
        y: Math.random() * 0.1,
      };
      if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
        positionParams[newBlocks.plane] = '+=' + (40 * Math.abs(newBlocks.direction));
      } else {
        positionParams[newBlocks.plane] = '-=' + (40 * Math.abs(newBlocks.direction));
      }
      gsap.to(newBlocks.chopped.position, { duration: 1, ...positionParams });
      gsap.to(newBlocks.chopped.rotation, { duration: 1, ...rotationParams });
    }
    this.addBlock();
  }

  addBlock() {
    let lastBlock = this.blocks[this.blocks.length - 1];
    if (lastBlock && lastBlock.state === lastBlock.STATES.MISSED) {
      return this.endGame();
   
