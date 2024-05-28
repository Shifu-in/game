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
      this.checkRew
