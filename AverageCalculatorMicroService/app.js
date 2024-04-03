const express = require('express');

const app = express();
const port = 1196;

const WINDOW_SIZE = 10;
let numberWindow = [2,4,6,8];

// Function to generate mock numbers
function generateNumbers(numberType) {
  switch (numberType) {
    case 'p': // PrimeNum
      return [6,8,10,12,14,16,18,20,22,24,26,28,30];
    case 'f': // FiboNum
      return [1, 1, 2, 3, 5];
    case 'e': // EvenNum
      return [2, 4, 6, 8, 10];
    case 'r': // RandomNum
      return Array.from({ length: 5 }, () =>
          Math.floor(Math.random() * 10));
    default:
      return [];
  }
}

app.get('/numbers/:numberid', (req, res) => {
  const numberType = req.params.numberid;

  if (!['p', 'f', 'e', 'r'].includes(numberType)) {
    return res.status(400).json({ error: 'Invalid num type' });
  }

  const numbers = generateNumbers(numberType).filter(num =>
      !numberWindow.includes(num));

  const windowPrevState = numberWindow.slice();

  numberWindow = numberWindow.slice(-(WINDOW_SIZE - numbers.length))
  numberWindow = numberWindow.concat(numbers);

  const avg = numberWindow.reduce((sum, num) => sum + num, 0) /
      numberWindow.length;

  res.json({
    numbers,
    windowPrevState,
    windowCurrState: numberWindow,
    avg
  });
});

app.listen(port, () => {
  console.log(`Avg Calculator microservice lists on port: ${port}`);
});