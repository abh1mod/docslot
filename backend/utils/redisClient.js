import { Redis } from '@upstash/redis'
import dotenv from 'dotenv';

dotenv.config();
const redisClient = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

await redisClient.set("foo", "bar");
await redisClient.get("foo");

export default redisClient;
