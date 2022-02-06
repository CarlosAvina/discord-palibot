import { SlashCommandBuilder, userMention, bold } from "@discordjs/builders";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

import numberToEmoji from "../utils/numberToEmoji.js";
import SHAME_GIF_URL from "../consts/shame.js";

const command = {
  name: "minecraft",
  description: "Minecraft commands",
};

const shame = {
  name: "shame",
  description: "Blame user",
  options: [
    { name: "user", description: "Shame on you" },
    { name: "description", description: "Description of the incident" },
  ],
};

const history = {
  name: "history",
  description: "List of incidents in the server",
};

const status = {
  name: "status",
  description: "Days without incidents",
};

const minecraft = {
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(shame.name)
        .setDescription(shame.description)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Shame on you")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Description of the incident")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName(history.name).setDescription(history.description)
    )
    .addSubcommand((subcommand) =>
      subcommand.setName(status.name).setDescription(status.description)
    ),
  async execute(interaction) {
    const { commandName, options } = interaction;
    if (commandName === command.name) {
      if (options.getSubcommand() === shame.name) {
        const user = options.getUser("user");
        const userId = user.id;
        const description = options.getString("description");

        await prisma.incidents
          .create({ data: { user: userId, description } })
          .then(async () => {
            const user = userMention(userId);

            const message = `${bold(
              "Un nuevo incidente ha ocurrido >:c"
            )}\n\n${user} fue rostead@ por '${description}'.\n\nDias sin incidentes en minecraft: :zero:\n${SHAME_GIF_URL}`;

            await interaction.reply(message);
          });
      }
      if (options.getSubcommand() === history.name) {
        const incidents = await prisma.incidents.findMany();

        if (incidents.length > 0) {
          let res = "Historial de incidentes\n";
          incidents.forEach((incident) => {
            const { id, user, description } = incident;

            const num = numberToEmoji(id);
            const username = userMention(user);

            res += `${num}. ${username} - ${description}\n`;
          });

          await interaction.reply(res);
        } else {
          await interaction.reply("Aún no hay incidentes :D");
        }
      }
      if (options.getSubcommand() === status.name) {
        const [lastIncident] = await prisma.incidents.findMany({
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        });

        if (lastIncident) {
          const incidentDate = new Date(lastIncident.createdAt);
          const currentDate = new Date();

          const timeDifference = currentDate.getTime() - incidentDate.getTime();
          const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );

          const emojiNumbers = numberToEmoji(daysDifference);

          await interaction.reply(`${emojiNumbers} dias sin incidentes :D`);
        } else {
          await interaction.reply(`Aún no hay incidentes :D`);
        }
      }
    }
  },
};

export default minecraft;
