class Utility {
  static shuffle(array, seed = 1) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    let random = () => {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    while (0 !== currentIndex) {
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  static setSrc(card) {
    let cardFace;
    if (card.toString()[1] === "0") {
      cardFace = `0${card.suit}`;
    } else {
      cardFace = card.toString();
    }

    return `https://deckofcardsapi.com/static/img/${cardFace}.png`;
  }
}

class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  toString() {
    return `${this.rank}${this.suit}`;
  }

  get points() {
    let points = 0;
    if (this.rank === "A") {
      points = 11;
    } else if (!parseInt(this.rank) || this.rank == 10) {
      points = 10;
    } else {
      points = this.rank;
    }
    return parseInt(points);
  }
}

class Hand {
  constructor(deck) {
    this.deck = deck;
    this.cardsInHand = [];
    this.drawCard();
    this.drawCard();
    if (!this.cardsInHand.every((card) => card instanceof Card)) {
      throw new TypeError("A Hand can only contain Cards");
    }
  }

  get points() {
    let totalPointsFromHand = 0;
    if (this.cardsInHand.length && this.cardsInHand.length >= 2) {
      if (
        this.cardsInHand[0].points == 11 &&
        this.cardsInHand[1].points == 11
      ) {
        totalPointsFromHand = 21;
      } else {
        totalPointsFromHand = this.cardsInHand.reduce((accumulator, card) => {
          return accumulator + card.points;
        }, 0);
      }
      if (this.cardsInHand.length > 5 && totalPointsFromHand < 21) {
        totalPointsFromHand = 21;
      }
    }
    return totalPointsFromHand;
  }

  drawCard() {
    this.cardsInHand.push(this.deck.draw());
  }

  get latestCard() {
    return this.cardsInHand[this.cardsInHand.length - 1];
  }

  toString(player) {
    return `${player} hand is ${this.cardsInHand}\n(${this.points})`;
  }
}

class Deck {
  constructor() {
    this.cards = this.createDeck();
  }

  createDeck() {
    let deck = [];
    const suit = ["S", "D", "C", "H"];
    const rank = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    for (let i = 0; i < suit.length; i++) {
      for (let j = 0; j < rank.length; j++) {
        deck.push(new Card(rank[j], suit[i]));
      }
    }
    return deck;
  }

  getCards() {
    return this.cards;
  }

  draw() {
    return this.cards.shift();
  }

  shuffle(seed = Date.now()) {
    return Utility.shuffle(this.cards, seed);
  }
}

window.addEventListener("DOMContentLoaded", function () {
  const deck = new Deck();
  deck.shuffle();
  const card1 = deck.draw();
  const card2 = deck.draw();

  let card1img = document.createElement("img");
  let card2img = document.createElement("img");

  card1img.setAttribute("id", "card1");
  card2img.setAttribute("id", "card2");

  card1img.src = Utility.setSrc(card1);
  card2img.src = Utility.setSrc(card2);

  document.querySelector(".cards").append(card1img, card2img);
});
