import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder, userMention, bold } from "@discordjs/builders";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import creds from "../../service-account-file.js";

import returnEmbedColor from "../utils/expiryEmbedColor.js";
import returnEmbedDescription from "../utils/expiryEmbedDescription.js";

initializeApp({
  credential: cert(creds),
});

const db = getFirestore();

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

const expiry = {
  name: "expiry",
  description: "Dice cuantos dias quedan del server con mr. increible :D",
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
    )
    .addSubcommand((subcommand) =>
      subcommand.setName(expiry.name).setDescription(expiry.description)
    ),
  async execute(interaction) {
    const { commandName, options } = interaction;
    if (commandName === command.name) {
      if (options.getSubcommand() === shame.name) {
        const user = options.getUser("user");
        const userId = user.id;
        const description = options.getString("description");

        const data = {
          user: userId,
          description,
          createdAt: Timestamp.fromDate(new Date()),
        };

        await db
          .collection("incidents")
          .doc()
          .set(data)
          .then(async () => {
            const message = `${bold(
              "Un nuevo incidente ha ocurrido >:c"
            )}\n\n${user} fue rostead@ por '${description}'.\n\nDias sin incidentes en minecraft: :zero:\n${SHAME_GIF_URL}`;

            await interaction.reply(message);
          })
          .catch((err) => console.error(err));
      }
      if (options.getSubcommand() === history.name) {
        const incidents = await db
          .collection("incidents")
          .get()
          .catch((err) => console.error(err));

        if (!incidents.empty) {
          let res = "Historial de incidentes\n";
          incidents.docs.forEach((incident, index) => {
            const { user, description } = incident.data();

            const num = numberToEmoji(index + 1);
            const username = userMention(user);

            res += `${num}. ${username} - ${description}\n`;
          });

          await interaction.reply(res);
        } else {
          await interaction.reply("Aún no hay incidentes :D");
        }
      }
      if (options.getSubcommand() === status.name) {
        const snapshot = await db
          .collection("incidents")
          .orderBy("createdAt", "desc")
          .limit(1)
          .get()
          .catch((err) => console.error(err));

        if (!snapshot.empty) {
          const { createdAt } = snapshot.docs[0].data();

          const incidentDate = createdAt.toDate();
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
      if (options.getSubcommand() === expiry.name) {
        const snapshot = await db
          .collection("expiry")
          .limit(1)
          .get()
          .catch((err) => console.error(err));

        if (!snapshot.empty) {
          const { start, expiry } = snapshot.docs[0].data();

          const currentDate = new Date();
          const startDate = start.toDate();
          const expiryDate = expiry.toDate();

          const numOfImages = 18;

          const timeDifference = expiryDate.getTime() - startDate.getTime();
          const daysAvailable = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );

          const chunks = daysAvailable / numOfImages;

          const timeRemaining = expiryDate.getTime() - currentDate.getTime();
          const daysRemaining = Math.floor(
            timeRemaining / (1000 * 60 * 60 * 24)
          );

          const place = numOfImages - Math.ceil(daysRemaining / chunks) + 1;
          const numString = String(place).padStart(2, "0");

          const url = `${process.env.STORAGE_URL}/o/mrincredible_${numString}.png?alt=media`;
          const emojiNumbers = numberToEmoji(daysRemaining);

          const exampleEmbed = new MessageEmbed()
            .setColor(returnEmbedColor(place))
            .setTitle(
              `Quedan ${emojiNumbers} ${
                daysRemaining === 1 ? "día" : "días"
              } para la destrucción del server de minecraft.`
            )
            .setDescription(returnEmbedDescription(place))
            .setImage(url);

          await interaction.reply({ embeds: [exampleEmbed] });
        }
      }
    }
  },
};

export default minecraft;
