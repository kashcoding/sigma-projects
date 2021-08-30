import { deck, playerTurn } from '../blackjack.js'
import { stub } from 'https://deno.land/x/mock/stub.ts'
import shuffle from './shuffle.js'

export function playerChooses(choices) {
  return stub(Deno.stdin, 'read', (p) => {
    const encoded = new TextEncoder().encode(choices.shift() + '\n')
    p.set(encoded)
    return Promise.resolve(encoded.length)
  })
}

export async function takePlayerTurn({ seed, logger } = {}) {
  let turnDeck

  if (!seed) {
    turnDeck = deck()
  } else {
    turnDeck = shuffle(deck(), seed)
  }

  let playerHand = [turnDeck.shift(), turnDeck.shift()]
  let isPlayerTurn = true

  while (isPlayerTurn) {
    isPlayerTurn = await playerTurn(turnDeck, playerHand, logger)
  }
}
