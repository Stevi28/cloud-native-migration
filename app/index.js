const express = require('express');
const { MongoClient } = require('mongodb');
const redis = require('redis');

const app = express();
const port = 3000;

async function checkMongo() {
  const client = new MongoClient('mongodb://mongodb:27017', {
    serverSelectionTimeoutMS: 3000,
  });
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  } finally {
    await client.close();
  }
}

async function checkRedis() {
  const client = redis.createClient({ url: 'redis://redis-cache:6379' });
  try {
    await client.connect();
    await client.ping();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  } finally {
    await client.quit();
  }
}

app.get('/', async (req, res) => {
  const [mongo, redisResult] = await Promise.all([checkMongo(), checkRedis()]);

  const status = (check) =>
    check.ok
      ? '✅ Connected'
      : `❌ Failed — ${check.error}`;

  res.send(`
    <h1>Hello! This app is running inside a Docker Container.</h1>
    <h2>DB Connectivity</h2>
    <ul>
      <li><strong>MongoDB:</strong> ${status(mongo)}</li>
      <li><strong>Redis:</strong> ${status(redisResult)}</li>
    </ul>
  `);
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
