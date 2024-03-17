import fs from 'node:fs/promises';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Route to get meals
app.get('/meals', async (req, res) => {
  try {
    const meals = await fs.readFile('./data/available-meals.json', 'utf8');
    res.json(JSON.parse(meals));
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to handle orders
app.post('/orders', async (req, res) => {
  try {
    const orderData = req.body.order;

    // Your validation logic here...

    const newOrder = {
      ...orderData,
      id: (Math.random() * 1000).toString(),
    };

    const orders = await fs.readFile('./data/orders.json', 'utf8');
    const allOrders = JSON.parse(orders);
    allOrders.push(newOrder);
    await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));

    res.status(201).json({ message: 'Order created!' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Handling OPTIONS requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Handling other requests
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
