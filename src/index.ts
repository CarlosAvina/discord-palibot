import { Client, Collection, Intents, CommandInteraction } from "discord.js";
import dotenv from "dotenv";
import { getFirestore } from "firebase-admin/firestore";
import logger from "./utils/logger";
import commands from "./commands/index";

import calculateServerExpiry from "./controllers/severExpiry";

const db = getFirestore();

dotenv.config();

const token = process.env.DISCORD_TOKEN;

// TODO: Fix any type later
const client: any = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  logger.info("Palibot preparado");

  const generalChannel = client.channels.cache.get("736044556021137523");
  generalChannel.send("No me desconenten, por favor...");
});

client.on("interactionCreate", async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
