import dotenv from 'dotenv';
import { Client, Intents } from "discord.js";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("Creo en la suerte");
});

client.login(token);
