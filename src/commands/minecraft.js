import { SlashCommandBuilder } from "@discordjs/builders";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const minecraft = {
  name: "minecraft",
  description: "Minecraft commands",
};

const blame = {
  name: "blame",
  description: "Blame user",
  options: [
    { name: "user", description: "The user to blame" },
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

export default {
  data: new SlashCommandBuilder()
    .setName(minecraft.name)
    .setDescription(minecraft.description)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(blame.name)
        .setDescription(blame.description)
        .addUserOption((option) =>
          option.setName("user").setDescription("The user to blame")
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Description of the incident")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName(history.name).setDescription(history.description)
    )
    .addSubcommand((subcommand) =>
      subcommand.setName(status.name).setDescription(status.description)
    ),
  async execute(interaction) {
    const { commandName, options, reply } = interaction;
    if (commandName === minecraft.name) {
      if (options.getSubcommand() === blame.name) {
        const user = options.getUser("user");
        const description = options.getString("description");

        await prisma.incidents.create({ data: { user, description } });
        await reply("Days without incidents in the server: 0");
      }
      if (options.getSubcommand() === history.name) {
        const incidents = await prisma.incidents.findMany();
        await reply(JSON.stringify(incidents));
      }
      if (options.getSubcommand() === status.name) {
        const [incident] = await prisma.incidents.findMany({
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        });

        const incidentDate = new Date(incident.createdAt);

        const currentDate = new Date();

        const timeDifference = currentDate.getTime() - incidentDate.getTime();
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

        await reply(`${daysDifference} days without incidents :D`);
      }
    }
  },
};
