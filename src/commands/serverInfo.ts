import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

const serverInfo = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      `Server name: ${interaction?.guild?.name}\nTotal members: ${interaction?.guild?.memberCount}`
    );
  },
};

export default serverInfo;
