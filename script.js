console.clear();

class Stage {
  // (Rest of the Stage class remains unchanged)
}

class Block {
  // (Rest of the Block class remains unchanged)
}

class Game {
  constructor() {
    // (Rest of the constructor remains unchanged)

    // Leaderboard
    this.leaderboard = [];

    // Start tracking time for rewards
    this.startTime = null;
    this.rewardInterval = 2 * 60 * 1000; // 2 minutes
    this.rewardPoints = 1000;
  }

  updateState(newState) {
    // (Rest of the updateState method remains unchanged)
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

      // Start the timer
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
    // Update the score with additional points
    this.scoreContainer.innerHTML = String(parseInt(this.scoreContainer.innerHTML) + points);
  }

  restartGame() {
    // (Rest of the restartGame method remains unchanged)
  }

  placeBlock() {
    // (Rest of the placeBlock method remains unchanged)
  }

  addBlock() {
    // (Rest of the addBlock method remains unchanged)
  }

  endGame() {
    this.updateState(this.STATES.ENDED);
    this.updateLeaderboard();
  }

  updateLeaderboard() {
    const score = parseInt(this.scoreContainer.innerHTML);
    this.leaderboard.push(score);
    this.leaderboard.sort((a, b) => b - a);
    console.log("Leaderboard:", this.leaderboard);
  }

  tick() {
    // (Rest of the tick method remains unchanged)
  }
}

document.getElementById('leaderboard').addEventListener('click', () => {
  alert("Leaderboard:\n" + game.leaderboard.join("\n"));
});

document.getElementById('faq').addEventListener('click', () => {
  alert("FAQ:\n\n" +
    "1. The objective of the game is to stack blocks as high as possible.\n" +
    "2. Click or press the spacebar to place the block.\n" +
    "3. You earn 1000 points for every 2 minutes actively spent in the game.\n" +
    "4. The points can be exchanged for cryptocurrency in the future.");
});

let game = new Game();
