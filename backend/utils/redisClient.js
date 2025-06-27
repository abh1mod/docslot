// redisClient.js
import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379' // default port
});

redisClient.on('error', err => console.error('Redis Error:', err));

await redisClient.connect(); // for ES Modules or top-level await

export default redisClient;
