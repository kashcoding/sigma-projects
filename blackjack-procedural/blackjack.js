import shuffle from "./support/shuffle.js";
import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";
import { getDefaultLogger } from "./support/logging.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

const loser = function (logger = defaultLogger) {
  logger.info("You lose!");
  balance -= parseInt(currentWager);
  logger.info(`Your new balance is ${balance}`);
};
const winner = function (logger = defaultLogger) {
  logger.info("You win!");
  balance += parseInt(currentWager);
  logger.info(`Your new balance is ${balance}`);
};
const drawing = function (logger = defaultLogger) {
  logger.info("Draw!");
  logger.info(`Your new balance is ${balance}`);
};
const defaultLogger = await getDefaultLogger();

const spadeEmoji = String.fromCodePoint(0x2660);
const heartEmoji = String.fromCodePoint(0x2665);
const clubEmoji = String.fromCodePoint(0x2663);
const diamondEmoji = String.fromCodePoint(0x2666);
const suit = [spadeEmoji, diamondEmoji, clubEmoji, heartEmoji];
const rank = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

let balance = 1000;
const balanceMessage = (logger = defaultLogger) =>
  logger.info(`Your new balance is ${balance}`);
let currentWager = 0;

let askWager = function (logger = defaultLogger) {
  let wagerValue = window.prompt("Enter your Wager!");
  if (wagerValue > balance) {
    logger.info("Not enough money");
    return askWager();
  } else if (wagerValue < 0) {
    logger.info("Enter a number greater than 0");
    return askWager();
  } else {
    currentWager = wagerValue;
  }
  return currentWager;
};

function newGameSeed() {
  return (
    Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) +
    1000000000000
  );
}

function continuePlaying(logger = defaultLogger) {
  const askContinue = window.prompt("Do you want to continue? (Y/N)");
  switch (askContinue) {
    case "Y": {
      askWager();
      play({ seed: Date.now() });
      return true;
    }
    case "N": {
      logger.info(`Game over. Thanks for playing.`);
      return false;
    }
  }
}

export function deck() {
  const cards = [];
  for (let i = 0; i < suit.length; i++) {
    for (let j = 0; j < rank.length; j++) {
      cards.push(rank[j] + suit[i]);
    }
  }
  return cards;
}

export function pointsFor(cards) {
  let totalPointsFromHand = 0;
  if (cards.length < 1) {
    return 0;
  } else if (cards[0][0] === "A" && cards[1][0] === "A") {
    return 21;
  } else if (cards.length >= 6 && totalPointsFromHand < 21) {
    return 21;
  } else {
    totalPointsFromHand = cards.reduce((accumulator, current) => {
      let cardValue = 0;
      if (current[0] === "A") {
        cardValue = 11;
      } else if (
        current[0] === "J" ||
        current[0] === "Q" ||
        current[0] === "K" ||
        current.length === 3
      ) {
        cardValue = 10;
      } else {
        cardValue = parseInt(current[0]);
      }
      return accumulator + cardValue;
    }, 0);
  }
  return totalPointsFromHand;
}

export async function playerTurn(deck, hand, logger = defaultLogger) {
  const playerHandStatement = () =>
    logger.info(`Your hand is ${hand.join(", ")}\n(${pointsFor(hand)} points)`);

  playerHandStatement();

  const ask = new Ask();
  let { action } = await ask.input({
    name: "action",
    message: 'What do you want to do? ("hit" or "stick")',
  });

  switch (action) {
    case "hit": {
      logger.info("Hitting");
      const newCard = deck.shift();
      hand.push(newCard);
      logger.info(`You drew ${newCard}`);
      if (pointsFor(hand) >= 21) {
        playerHandStatement();
        return false;
      } else {
        return true;
      }
    }
    case "stick": {
      return false;
    }
    default: {
      break;
    }
  }
}

export async function play({ seed = Date.now(), logger = defaultLogger } = {}) {
  const shuffledDeck = shuffle(deck(), seed);
  console.log(seed);
  const playerHand = [shuffledDeck.shift(), shuffledDeck.shift()];

  const dealerHand = [];
  const newDealerCard = shuffledDeck.shift();
  const dealerHandStatement = () =>
    logger.info(
      `Dealer's hand is ${dealerHand.join(", ")}\n(${pointsFor(
        dealerHand
      )} points)`
    );

  let isPlayerTurn = true;

  while (isPlayerTurn) {
    isPlayerTurn = await playerTurn(shuffledDeck, playerHand, logger);
  }

  //Dealer's turn
  if (isPlayerTurn === false) {
    dealerHand.push(shuffledDeck.shift(), shuffledDeck.shift());
    if (pointsFor(playerHand) === 21) {
      dealerHandStatement();
      winner();
      continuePlaying();
    } else if (pointsFor(playerHand) > 21) {
      loser();
      continuePlaying();
    } else if (pointsFor(playerHand) < 21) {
      dealerHandStatement();
      while (pointsFor(dealerHand) < 17) {
        logger.info(`Dealer hitting`);
        dealerHand.push(newDealerCard);
        logger.info(`Dealer drew ${newDealerCard}`);
        dealerHandStatement();
      }
      if (pointsFor(dealerHand) > 16) {
        if (
          pointsFor(dealerHand) > 21 ||
          pointsFor(playerHand) > pointsFor(dealerHand)
        ) {
          winner();
          continuePlaying();
        } else if (
          pointsFor(playerHand) < pointsFor(dealerHand) &&
          pointsFor(dealerHand) <= 21
        ) {
          loser();
          continuePlaying();
        } else if (pointsFor(playerHand) === pointsFor(dealerHand)) {
          drawing();
          continuePlaying();
        }
      }
    }
  }
}

if (import.meta.main) {
  const { seed } = parse(Deno.args);
  console.log(`Welcome to Blackjack!`);
  balanceMessage();
  askWager();
  play({ seed });
}
