import { SlashCommandBuilder } from "@discordjs/builders";

const ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

export default ping;
