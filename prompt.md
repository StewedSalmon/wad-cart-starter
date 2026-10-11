write cartTotal(items, options) function that returns the total price of items in a cart.
Parameter structures: 
`items`: `[{ name, price, qty }]` · `options`: `{ vatRate, freeShipFrom, shipFee }`
inside the function, calculate:
subtotal = sum of price * qty
- VAT = `vatRate` applied to the subtotal
- shipping = `0` when `subtotal >= freeShipFrom`, otherwise `shipFee`
- return `subtotal + VAT + shipping`, **a number**, rounded to the nearest whole number
Edge cases:
- if cart is empty: return 0
- if price < 0 or qty is not a positive integer: throw RangeError
Dependencies: node - node:test only
Make changes to function cartTotal(items, options) template in ../src/cart.js only

add 4 test cases for cartTotal(items, options) imported from ../src/cart.js
1: cart is empty or does not exist. expect: returns 0
2: price < 0 on one or multiple items. expect: RangeError
3: qty is not a positive integer on one or multiple items. expect: RangeError
4: subtotal >= freeShipFrom. expect: returns subtotal + vat (shipping = 0)
Dependencies: node - node:test only
Leave the example test as is.
Make changes to ../test/cart.test.js only

add 2 more test cases in the quantity check in ../test/cart.test.js
1: qty is not an integer, for example: 1.5
2: qty < 0
expect: RangeError
Dependencies: node - node:test only
Make changes to ../test/cart.test.js only

set up Node.js CI for Github that runs the following commands when new code is pushed:
- npm install to install dependencies in package.json
- npm test to run the test suite in ../test/cart.test.js
Dependencies: node - node:test only
Don't change the content of existing files in the workplace

write a format test suite as part of CI in ../.github\workflows\main.yml which runs whenever new code is pushed and fails when current code does not satisfy all conditions
- initiate ../test/format.test.js and write the format test suite using 'Style' rules in AGENTS.md
- add the command to run this test in package.json
- use the command in ../.github\workflows\main.yml, place it before npm test
Dependencies: node - node:test only
Make changes to the specified files only