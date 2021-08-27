import {
  assert,
  assertEquals,
  assertStringIncludes,
  assertArrayIncludes,
} from "https://deno.land/std/testing/asserts.ts";
import { deck, pointsFor, play } from "./blackjack.js";

import { getTestLogger } from "./support/logging.ts";
import { playerChooses, takePlayerTurn } from "./support/testing.js";

function getPoints(handInfo) {
  const findPoints = handInfo[handInfo.length - 1].split("(");
  console.log(findPoints);

  return parseInt(findPoints[1][0] + findPoints[1][1]);
}

Deno.test("play(): dealer busting displays a 'you win' message", async () => {
  const { logger, handler } = await getTestLogger();
  const c = playerChooses(["stick"]);

  await play({ logger, seed: 1629458342200 });

  const dealerHandInfo = handler.messages.filter((m) =>
    m.startsWith("Dealer's hand is")
  );
  console.log(dealerHandInfo);

  const dealerPoints = getPoints(dealerHandInfo);

  assert(dealerPoints > 21);
  assertArrayIncludes(handler.messages, ["You win!"]);
  c.restore();
});

// A test that confirms that the player wins when they have the higher score
Deno.test("play(): player wins when they have the higher score", async () => {
  const { logger, handler } = await getTestLogger();
  const c = playerChooses(["stick"]);

  await play({ logger, seed: 1629458423698 });

  const playerHandInfo = handler.messages.filter((m) =>
    m.startsWith("Your hand is")
  );
  const dealerHandInfo = handler.messages.filter((m) =>
    m.startsWith("Dealer's hand is")
  );

  const playerPoints = getPoints(playerHandInfo);
  const dealerPoints = getPoints(dealerHandInfo);

  assert(playerPoints > dealerPoints);
  assertArrayIncludes(handler.messages, ["You win!"]);
  c.restore();
});

// A test that confirms that the player loses when they have the lower score using getPoints()
Deno.test("play(): player loses when they have the lower score", async () => {
  const { logger, handler } = await getTestLogger();
  const c = playerChooses(["hit", "stick"]);

  await play({ logger, seed: 1629458256086 });

  const playerHandInfo = handler.messages.filter((m) =>
    m.startsWith("Your hand is")
  );
  const dealerHandInfo = handler.messages.filter((m) =>
    m.startsWith("Dealer's hand is")
  );

  const playerPoints = getPoints(playerHandInfo);
  const dealerPoints = getPoints(dealerHandInfo);

  assert(playerPoints < dealerPoints);
  assertArrayIncludes(handler.messages, ["You lose!"]);
  c.restore();
});
