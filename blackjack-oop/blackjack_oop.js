import shuffle from '../../week1/blackjack/support/shuffle.js'
import Ask from 'https://deno.land/x/ask@1.0.6/mod.ts'
import { getDefaultLogger } from '../../week1/blackjack/support/logging.ts'

// import { playerTurn } from '../../week1/blackjack/blackjack.js'
const defaultLogger = await getDefaultLogger()
const LOSE_MESSAGE = 'You lose!'
const WIN_MESSAGE = 'You win!'
const DRAW_MESSAGE = 'Draw!'

export class Card {
  constructor(rank, suit) {
    this.rank = rank
    this.suit = suit.toUpperCase()
  }

  toString() {
    return `${this.rank}${this.suit}`
  }

  get points() {
    let points = 0
    if (this.rank === 'A') {
      points = 11
    } else if (!parseInt(this.rank) || this.rank == 10) {
      points = 10
    } else {
      points = this.rank
    }
    return parseInt(points)
  }
}

export class Hand {
  constructor(cards) {
    if (!cards.every((card) => card instanceof Card)) {
      throw new TypeError('A Hand can only contain Cards')
    }

    this.cards = cards
  }

  get points() {
    let totalPointsFromHand = 0
    if (this.cards.length === 0) {
      return totalPointsFromHand
    } else if (
      this.cards[0].points == 11 &&
      this.cards[1].points == 11 &&
      this.cards.length == 2
    ) {
      totalPointsFromHand = 21
    } else {
      totalPointsFromHand = this.cards.reduce((accumulator, card) => {
        return accumulator + card.points
      }, 0)
      if (this.cards.length > 5 && totalPointsFromHand < 21) {
        totalPointsFromHand = 21
      }
    }
    return totalPointsFromHand
  }

  addCard(card) {
    this.cards.push(card)
  }

  toString(player) {
    return `${player} hand is ${this.cards}\n(${this.points})`
  }
}

export class Deck {
  constructor() {
    this.cards = this.createDeck()
  }

  createDeck() {
    let deck = []
    const suit = ['S', 'D', 'C', 'H']
    const rank = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
    for (let i = 0; i < suit.length; i++) {
      for (let j = 0; j < rank.length; j++) {
        deck.push(new Card(rank[j], suit[i]))
      }
    }
    return deck
  }

  draw() {
    return this.cards.shift()
  }

  shuffle(seed = Date.now()) {
    return shuffle(this.cards, seed)
  }
}

class Game {
  constructor(logger = defaultLogger) {
    this.logger = logger
    this.gameDeck = new Deck()
    this.gameDeck.shuffle()
    this.playerHand = new Hand([this.gameDeck.draw(), this.gameDeck.draw()])
    this.isPlayerTurn = true

    this.playerTurn()
  }

  hit(hand) {
    let cardDrawn = this.gameDeck.draw()
    hand.addCard(cardDrawn)
    if (this.isPlayerTurn) {
      this.logger.info(`You drew ${cardDrawn}`)
    } else {
      this.logger.info(`Dealer drew ${cardDrawn}`)
    }
  }

  async playerTurn() {
    while (this.isPlayerTurn) {
      this.logger.info(this.playerHand.toString('Your'))
      const ask = new Ask()
      let { action } = await ask.input({
        name: 'action',
        message: 'What do you want to do? ("hit" or "stick")'
      })

      switch (action) {
        case 'hit':
          this.logger.info('hitting')
          this.hit(this.playerHand)
          this.isPlayerTurn = this.checkPlayerLost()
          break
        case 'stick':
          this.isPlayerTurn = false
          this.dealersTurn()
          break
        default:
          continue
      }
    }
    this.checkWhoWon()
  }

  checkPlayerLost() {
    let hasNotLost = true

    if (this.playerHand.points > 21) {
      this.logger.info(this.playerHand.toString('Your'))
      this.logger.info(LOSE_MESSAGE)
      hasNotLost = false
    }

    return hasNotLost
  }

  dealersTurn() {
    this.dealerHand = new Hand([this.gameDeck.draw(), this.gameDeck.draw()])
    this.logger.info(this.dealerHand.toString('Dealers'))
    while (this.dealerHand.points < 17) {
      this.logger.info('hitting')
      this.hit(this.dealerHand)
      this.logger.info(this.dealerHand.toString('Dealers'))
    }
  }

  checkWhoWon() {
    const playerScore = this.playerHand.points
    const dealerScore = this.dealerHand.points

    if (playerScore === dealerScore) {
      this.logger.info(DRAW_MESSAGE)
    } else if (playerScore > dealerScore || dealerScore > 21) {
      this.logger.info(WIN_MESSAGE)
    } else if (dealerScore > playerScore) {
      this.logger.info(LOSE_MESSAGE)
    }
  }
}

// this.dealerHand = new Hand([gameDeck.draw(), gameDeck.draw()])
let blackjack = new Game()
