const crypto = require("crypto");
const Table = require("cli-table3");

class Dice {
  constructor(values) {
    if (values.length !== 6 || !values.every(Number.isInteger)) {
      throw new Error("Each die must have exactly 6 integers.");
    }
    this.values = values;
  }

  roll(index) {
    return this.values[index];
  }
}

class DiceParser {
  static parse(args) {
    if (args.length < 3) {
      throw new Error(
        "At least 3 dice are required. Example: node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3"
      );
    }
    return args.map((arg) => new Dice(arg.split(",").map(Number)));
  }
}

class FairRandom {
  static generateKey() {
    return crypto.randomBytes(32).toString("hex");
  }

  static generateValue(range, key) {
    const secureRandom = crypto.randomBytes(32);
    const number = parseInt(secureRandom.toString("hex"), 16) % range;

    const hmac = crypto.createHmac("sha3-256", key);
    hmac.update(number.toString());
    return { number, hmac: hmac.digest("hex") };
  }

  static verifyHMAC(number, key, hmac) {
    const newHmac = crypto.createHmac("sha3-256", key);
    newHmac.update(number.toString());
    return newHmac.digest("hex") === hmac;
  }
}

class ProbabilityCalculator {
  static calculateWinProbabilities(dice) {
    const probabilities = [];
    for (let i = 0; i < dice.length; i++) {
      probabilities[i] = [];
      for (let j = 0; j < dice.length; j++) {
        if (i === j) {
          probabilities[i][j] = "-";
        } else {
          probabilities[i][j] = ProbabilityCalculator.getWinProbability(
            dice[i],
            dice[j]
          ).toFixed(4);
        }
      }
    }
    return probabilities;
  }

  static getWinProbability(die1, die2) {
    let winCount = 0;
    let totalCount = 0;

    for (let v1 of die1.values) {
      for (let v2 of die2.values) {
        if (v1 > v2) winCount++;
        totalCount++;
      }
    }

    return winCount / totalCount;
  }
}

class HelpTable {
  static display(dice, probabilities) {
    const table = new Table({
      head: [
        "User Dice \\ Computer Dice",
        ...dice.map((d) => d.values.join(",")),
      ],
    });

    probabilities.forEach((row, i) => {
      table.push({ [dice[i].values.join(",")]: row });
    });

    console.log("Probability of winning for the user:");
    console.log(table.toString());
  }
}

class Game {
  constructor(dice) {
    this.dice = dice;
  }

  async play() {
    console.log("Let's determine who makes the first move.");
    const fairRandom = new FairRandom();

    // First move: Fair randomness
    const key = FairRandom.generateKey();
    const computerChoice = FairRandom.generateValue(2, key);
    console.log(`HMAC=${computerChoice.hmac}`);
    const userGuess = await this.promptUser("Guess my number (0 or 1): ");
    if (userGuess === "X") return;

    const userNumber = parseInt(userGuess);
    console.log(`My selection: ${computerChoice.number} (KEY=${key}).`);

    if (computerChoice.number === userNumber) {
      console.log("You win the toss and choose first.");
      await this.userTurn();
    } else {
      console.log("I win the toss and choose first.");
      await this.computerTurn();
    }
  }

  async userTurn() {
    console.log("Choose your dice:");
    this.dice.forEach((die, index) => {
      console.log(`${index} - ${die.values.join(",")}`);
    });
    const choice = await this.promptUser("Your selection: ");
    if (choice === "X") return;

    const userDie = this.dice[parseInt(choice)];
    console.log(`You chose: ${userDie.values.join(",")}`);
    this.playRounds(userDie);
  }

  async computerTurn() {
    const computerDie = this.dice[Math.floor(Math.random() * this.dice.length)];
    console.log(`I chose: ${computerDie.values.join(",")}`);
    await this.userTurn();
  }

  async playRounds(userDie) {
    // User Roll
    console.log("It's your turn to roll.");
    const key = FairRandom.generateKey();
    const userRoll = FairRandom.generateValue(6, key);
    console.log(`HMAC=${userRoll.hmac}`);
    const userGuess = await this.promptUser("Enter your number (0-5): ");
    if (userGuess === "X") return;

    const userNumber = parseInt(userGuess);
    console.log(`Your roll: ${userDie.roll(userNumber)}`);

    // Computer Roll
    console.log("It's my turn to roll.");
    const compDie = this.dice[Math.floor(Math.random() * this.dice.length)];
    const compRoll = FairRandom.generateValue(6, key);

    console.log("Comparing Rolls...");
  }

  async promptUser(message) {
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(message, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }
}

function main() {
  const args = process.argv.slice(2);
  try {
    const dice = DiceParser.parse(args);
    const game = new Game(dice);
    game.play();
  } catch (error) {
    console.error(error.message);
  }
}

main();
