import { Client, Collection, Intents } from "discord.js";
import dotenv from "dotenv";
import { getFirestore } from "firebase-admin/firestore";
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
  console.log("Palibot preparado");

  const devChannel = client.channels.cache.get("929571416158908436");

  const hour = 1000 * 60 * 60;

  setInterval(async () => {
    const tenDaysBeforeDate = new Date("05/26/2022");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(`Daily cron was run: ${today}:${hour}`);

    const hours = new Date().getHours();

    if (hours === 19) {
      if (today < tenDaysBeforeDate) {
        if (today.getDate() % 5 === 0) {
          await calculateServerExpiry(db, async (embed) => {
            devChannel.send({ embeds: [embed] });
          });
        }
      } else {
        await calculateServerExpiry(db, async (embed) => {
          devChannel.send({ embeds: [embed] });
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
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
