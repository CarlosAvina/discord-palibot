import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

const userInfo = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Replies with user info!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
    );
  },
};

export default userInfo;
