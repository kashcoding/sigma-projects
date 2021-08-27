import {
  assert,
  assertEquals,
  assertStringIncludes,
  assertArrayIncludes,
} from "https://deno.land/std/testing/asserts.ts";
import { deck, pointsFor, play } from "./blackjack.js";

import { getTestLogger } from "./support/logging.ts";
import { playerChooses, takePlayerTurn } from "./support/testing.js";

Deno.test(
  "pointsFor() calculates the correct amount of points when only number cards are used",
  () => {
    assertEquals(pointsFor(["7♥", "2♦"]), 9);
  }
);

Deno.test("deck(): a fresh deck in 'new deck order'", () => {
  assertEquals(deck(), [
    "A♠",
    "2♠",
    "3♠",
    "4♠",
    "5♠",
    "6♠",
    "7♠",
    "8♠",
    "9♠",
    "10♠",
    "J♠",
    "Q♠",
    "K♠",
    "A♦",
    "2♦",
    "3♦",
    "4♦",
    "5♦",
    "6♦",
    "7♦",
    "8♦",
    "9♦",
    "10♦",
    "J♦",
    "Q♦",
    "K♦",
    "A♣",
    "2♣",
    "3♣",
    "4♣",
    "5♣",
    "6♣",
    "7♣",
    "8♣",
    "9♣",
    "10♣",
    "J♣",
    "Q♣",
    "K♣",
    "A♥",
    "2♥",
    "3♥",
    "4♥",
    "5♥",
    "6♥",
    "7♥",
    "8♥",
    "9♥",
    "10♥",
    "J♥",
    "Q♥",
    "K♥",
  ]);
});

Deno.test(
  "pointsFor() calculates the correct amount of points when no cards are present",
  () => {
    assertEquals(pointsFor([]), 0);
  }
);

Deno.test(
  "pointsFor() calculates the correct amount of points when only number and face cards are used",
  () => {
    assertEquals(pointsFor(["3♦", "J♣", "Q♥", "2♥", "A♣"]), 36);
  }
);

Deno.test(
  "pointsFor() calculates the correct amount of points when there are only two aces",
  () => {
    assertEquals(pointsFor(["A♦", "A♣"]), 21);
  }
);

Deno.test(
  "pointsFor() calculates the correct amount of points when there are two aces and another card",
  () => {
    assertEquals(pointsFor(["2♦", "A♦", "A♣"]), 24);
  }
);

Deno.test(
  'playerTurn(): choosing to hit outputs a "Hitting" message',
  async () => {
    const { logger, handler } = await getTestLogger();
    const c = playerChooses(["hit", "stick"]);

    await takePlayerTurn({ logger });
    assertArrayIncludes(handler.messages, ["Hitting"]);
    c.restore();
  }
);

Deno.test("playerTurn(): choosing to hit shows an updated hand", async () => {
  const { logger, handler } = await getTestLogger();
  const c = playerChooses(["hit", "stick"]);

  await takePlayerTurn({ logger });
  const handInfo = handler.messages.filter((m) => m.startsWith("Your hand is"));

  assert(handInfo[1]);

  assertStringIncludes(handInfo[1], "Your hand is A♠, 2♠, 3♠");
  c.restore();
});

Deno.test(
  "playerTurn(): choosing to hit shows an updated point total",
  async () => {
    const { logger, handler } = await getTestLogger();
    const c = playerChooses(["hit", "stick"]);

    await takePlayerTurn({ logger });
    const handInfo = handler.messages.filter((m) =>
      m.startsWith("Your hand is")
    );

    assert(handInfo[1]);

    assertStringIncludes(handInfo[1], "(16 points)");
    c.restore();
  }
);

Deno.test(
  "playerTurn(): hitting and busting ends the player's turn",
  async () => {
    const { logger, handler } = await getTestLogger();
    const c = playerChooses(["hit"]);

    await takePlayerTurn({ logger, seed: 1595870164262 });

    assertEquals(c.calls.length, 1);
    c.restore();
  }
);

Deno.test(
  "playerTurn(): hitting and busting displays a 'you lose' message",
  async () => {
    const { logger, handler } = await getTestLogger();
    const c = playerChooses(["hit", "hit"]);

    await play({ logger, seed: 1629459442915 });
    assertArrayIncludes(handler.messages, ["You lose!"]);
    c.restore();
  }
);
