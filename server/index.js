const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const cron = require('node-cron');

const app = express();
const port = 3001;

// Replace <password> with your actual password
const uri = 'mongodb+srv://tejapanda:Teja1234@cluster1.ljowk9k.mongodb.net/stock_crypto_db?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function fetchData(symbol) {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = response.data;
    console.log(`Fetched data for ${symbol}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

async function storeData(symbol) {
  const data = await fetchData(symbol);
  if (data) {
    const db = client.db('stock_crypto_db'); // Database name
    const collection = db.collection('stock_crypto'); // Collection name

    // Define the threshold for old data (e.g., one day ago)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Remove data older than one day
    await collection.deleteMany({ symbol, timestamp: { $lt: oneDayAgo } });
    console.log(`Removed old data for ${symbol}`);

    // Insert new data
    await collection.insertOne({ symbol, data, timestamp: new Date() });
    console.log(`Inserted new data for ${symbol}`);
  }
}

// Poll data every 10 seconds
cron.schedule('*/10 * * * * *', () => {
  console.log('Running cron job...');
  storeData('bitcoin');
  storeData('google');
});

app.get('/api/data/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const db = client.db('stock_crypto_db'); // Database name
  const collection = db.collection('stock_crypto'); // Collection name
  const data = await collection.find({ symbol }).sort({ timestamp: -1 }).limit(20).toArray();
  res.json(data);
});


client.connect(err => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
