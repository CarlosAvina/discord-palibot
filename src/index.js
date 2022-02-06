import dotenv from "dotenv";
import { Client, Intents, MessageActionRow, MessageButton } from "discord.js";
import { bold, userMention } from "@discordjs/builders";

import minecraft from "./commands/minecraft.js";
import { script } from "./consts/beemovie.js";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

function splitInto(str, len) {
  var regex = new RegExp(".{" + len + "}|.{1," + Number(len - 1) + "}", "g");
  return str.match(regex);
}

client.once("ready", () => {
  console.log("Palibot preparado");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const { commandName } = interaction;

    if (commandName === "ping") {
      await interaction.reply("Pong!");
    } else if (commandName === "server") {
      await interaction.reply(
        `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
      );
    } else if (commandName === "user") {
      await interaction.reply(
        `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
      );
    } else if (commandName === "beemovie") {
      const chunks = splitInto(script, 1000);
      chunks.forEach(async (item) => await interaction.reply(item));
    } else if (commandName === "question") {
      const firstOption = new MessageButton()
        .setCustomId("first")
        .setLabel("Ruffles")
        .setStyle("PRIMARY");

      const secondOption = new MessageButton()
        .setCustomId("second")
        .setLabel("Currumais")
        .setStyle("SECONDARY");

      const row = new MessageActionRow().addComponents([
        firstOption,
        secondOption,
      ]);

      await interaction.reply({
        content: "Ruffles vs Currumais",
        components: [row],
      });
    } else if (commandName === "minecraft") {
      await minecraft.execute(interaction);
    }
  }

  if (interaction.isButton()) {
    const collector = interaction.channel.createMessageComponentCollector({
      time: 15000,
    });

    collector.on("collect", async (i) => {
      const userId = i.user.id;
      const user = userMention(userId);
      const prevMessage = i.message.content;

      const ruffles = bold("Ruffles");
      const churrumais = bold("Churrumais");

      if (i.customId === "first") {
        const newContent = `${prevMessage}\n${ruffles}\n${user}\n${churrumais}`;
        await i.deferUpdate();
        await i.editReply({ content: newContent, components: [] });
      }
      if (i.customId === "second") {
        const newContent = `${prevMessage}\n${ruffles}\n${churrumais}\n${user}`;
        await i.deferUpdate();
        await i.editReply({
          content: newContent,
          components: [],
        });
      }
    });

    collector.on(
      "end",
      async (collected) =>
        await interaction.reply(`Collected ${collected.size} items`)
    );
  }
});

client.login(token);
