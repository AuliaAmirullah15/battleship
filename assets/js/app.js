function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      enemyHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
      window: {
        width: 0,
        height: 0,
      },
    };
  },
  computed: {
    enemyBarStyles() {
      if (this.enemyHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.enemyHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    permissionSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
    permissionHeal() {
      return this.playerHealth >= 100;
    },
    positionTitile() {
      return { "float-center": window.width <= 576 };
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.enemyHealth <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Player lost
        this.winner = "enemyr";
      }
    },
    enemyHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Enemy lost
        this.winner = "player";
      }
    },
  },
  methods: {
    startGame() {
      this.playerHealth = 100;
      this.enemyHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
    },
    attackEnemy() {
      this.currentRound++;
      const attackValue = getRandomValue(12, 5);
      this.enemyHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(15, 8);
      this.playerHealth -= attackValue;
      this.addLogMessage("enemy", "attack", attackValue);
    },
    specialAttack() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.enemyHealth -= attackValue;
      this.addLogMessage("player", "special-attack", attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      this.playerHealth =
        this.playerHealth + healValue > 100
          ? (this.playerHealth = 100)
          : (this.playerHealth += healValue);
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "enemy";
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      }); // push an item at the beginning of the array. It's the opposite of push
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
});

app.mount("#game");
