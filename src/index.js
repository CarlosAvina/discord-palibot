import dotenv from "dotenv";
import { Client, Intents } from "discord.js";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.login(token);

client.once("ready", () => {
  const channel = client.channels.cache.get("929571416158908436");
  channel.send("¿Crees en la suerte?");
});
