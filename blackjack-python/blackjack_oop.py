from functools import reduce 
import random

LOSE_MESSAGE = 'You lose!'
WIN_MESSAGE = 'You win!'
DRAW_MESSAGE = 'Draw!'

class Card:
  def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit

  def to_string(self):
    return f'{self.rank}{self.suit}'

  @property
  def get_points(self):
    points = 0
    if self.rank == 'A':
      points = 11
    elif type(self.rank) != int or self.rank == 10:
      points = 10
    else:
      points = self.rank
    return points

class Hand:
  def __init__(self, deck):
    self.deck = deck
    self.cards_in_hand = []
    self.draw_card()
    self.draw_card()

  @property
  def get_points(self):
    total_points_in_hand = 0
    if len(self.cards_in_hand) >= 2:
      if self.cards_in_hand[0].get_points == 11 and self.cards_in_hand[1].get_points == 11:
        total_points_in_hand = 21
      else:
        total_points_in_hand = reduce((lambda a, b: a + b.get_points), self.cards_in_hand, 0)
    if len(self.cards_in_hand) > 5 and total_points_in_hand < 21:
      total_points_in_hand = 21
    return total_points_in_hand

  def draw_card(self):
    self.cards_in_hand.append(self.deck.draw())

  def print_cards(self, cards):
    return ', '.join([card.to_string() for card in cards])

  @property
  def latest_card(self):
    return self.cards_in_hand[len(self.cards_in_hand) - 1]

  def to_string(self, player):
    return f'{player} hand is {self.print_cards(self.cards_in_hand)}\n({self.get_points})'

class Deck:
  def __init__(self):
      self.cards = self.create_deck()

  def create_deck(self):
    deck = []
    suits = ['S', 'D', 'C', 'H']
    ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
    for suit in suits:
      for rank in ranks:
        deck.append(Card(rank, suit))
    return deck

  def get_cards(self):
    return self.cards
  
  def draw(self):
    return self.cards.pop(0)

  def shuffle(self):
    return random.shuffle(self.cards)

class Game:
  def __init__(self):
      self.game_deck = Deck()
      self.game_deck.shuffle()
      self.player_hand = Hand(self.game_deck)
      self.is_player_turn = True
      self.player_turn()

  def player_turn(self):
    while self.is_player_turn == True:
      print(self.player_hand.to_string('Your'))
      print('What do you want to do? ("hit" or "stick")')
      answer = input()
      if answer == 'hit':
        print('Hitting')
        self.hit(self.player_hand)
        self.is_player_turn = self.check_player_lost()
        break
      elif answer == 'stick':
        self.is_player_turn = False
        self.dealers_turn()
        break
      else:
        continue

  def dealers_turn(self):
    self.dealer_hand = Hand(self.game_deck)
    print(self.dealer_hand.to_string('Dealers'))
    while self.dealer_hand.get_points < 17:
      print('Hitting')
      self.hit(self.dealer_hand)
      print(self.dealer_hand.to_string('Dealers'))
    self.check_who_won()
  
  def hit(self, hand):
    hand.draw_card()
    if self.is_player_turn:
      print(f'You drew {hand.latest_card.to_string()}')
    else:
      print(f'Dealer drew {hand.latest_card.to_string()}')

  def check_player_lost(self):
    has_not_lost = True
    if self.player_hand.get_points > 21:
      print(self.player_hand.to_string('Your'))
      print(LOSE_MESSAGE)
      has_not_lost = False
    return has_not_lost
  
  def check_who_won(self):
    player_score = self.player_hand.get_points
    dealer_score = self.dealer_hand.get_points
    if player_score == dealer_score:
      print(DRAW_MESSAGE)
    elif player_score > dealer_score or dealer_score > 21:
      print(WIN_MESSAGE)
    elif dealer_score > player_score:
      print(LOSE_MESSAGE)



blackjack = Game()