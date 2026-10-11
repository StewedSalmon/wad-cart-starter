## 2026-10-10 - cartTotal function
Tool: Copilot CLI
Asked for: cartTotal function to calculate total value of items in a cart and apply the spec in README.md
Kept: All
Changed: None
Rejected: None
By hand: None 

## 2026-10-10 - cartTotal test cases
Tool: Copilot CLI
Asked for: 4 test cases for cartTotal covering empty or not existing cart, negative price, non-positive integer quantity, free shippping threshold.
Kept: 3 edge edge case tests (negative price, invalid qty, shipping threshold) and empty array check in the first test.
Changed: None
Rejected: the non existing cart check (which was caused by my prompt: "cart is empty or does not exist.") in the first test.
By hand: added a case in free shippping threshold check where subtotal > freeShipFrom. The AI only wrote the case where they are equal.

## 2026-10-11 - adjust cartTotal test cases
Tool: Opencode (GPT-5.6 Luna)
Asked for: 2 test cases for cartTotal that cover fractional and negative quantity.
Kept: All
Rejected: None
By hand: None

## 2026-10-11 - Node.js CI setup
Tool: Opencode (GPT-5.6 Luna)
Asked for: Node.js workflow for Github to install dependencies in package.json and run the test suite whenever new code is pushed
Kept: All
Rejected: None
By hand: Set up Actions manually on Github website using the code it provided

## 2026-10-11 - Format checker in CI
Tool: Opencode (Claude Haiku 5.5)
Asked for: Format test suite using the spec in AGENTS.md that is run before npm test
Kept: All
Rejected: the npm run test:format setup in package.json and main.yml. npm test already runs both test suites
By hand: None

