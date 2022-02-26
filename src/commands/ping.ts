import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

const ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Pong!");
  },
};

export default ping;
