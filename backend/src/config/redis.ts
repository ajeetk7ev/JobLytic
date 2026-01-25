import { createClient } from "redis";

const redisConfig = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      username: process.env.REDIS_USERNAME || "default",
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    };

const redisClient = createClient(redisConfig);

redisClient.on("connect", () => console.log("Redis client connecting..."));
redisClient.on("ready", () =>
  console.log("Redis client connected and ready to use"),
);
redisClient.on("error", (err) => console.error("Redis Client Error", err));

export default redisClient;
