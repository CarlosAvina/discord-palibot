import { Client, Collection, Intents } from "discord.js";
import dotenv from "dotenv";
import { getFirestore } from "firebase-admin/firestore";
import logger from "./utils/logger.js";
import commands from "./commands/index.js";

import calculateServerExpiry from "./controllers/severExpiry.js";

const db = getFirestore();

dotenv.config();

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  logger.info("Palibot preparado");

  const minecraftChannel = client.channels.cache.get("812544927325224980");

  const hour = 1000 * 60 * 60;

  setInterval(async () => {
    const tenDaysBeforeDate = new Date("05/26/2022");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hours = new Date().getHours();
    logger.info(`Daily cron was run: ${today}:${hours}`);

    if (hours === 19) {
      if (today < tenDaysBeforeDate) {
        if (today.getDate() % 5 === 0) {
          await calculateServerExpiry(db, async (embed) => {
            minecraftChannel.send({ embeds: [embed] });
          });
        }
      } else {
        await calculateServerExpiry(db, async (embed) => {
          minecraftChannel.send({ embeds: [embed] });
        });
      }
    }
  }, hour);
});

client.on("interactionCreate", async (interaction) => {
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
