import { MessageEmbed } from "discord.js";
import logger from "../utils/logger.js";

import returnEmbedColor from "../utils/expiryEmbedColor.js";
import returnEmbedDescription from "../utils/expiryEmbedDescription.js";
import numberToEmoji from "../utils/numberToEmoji.js";

const calculateServerExpiry = async (db, action) => {
  const snapshot = await db
    .collection("expiry")
    .limit(1)
    .get()
    .catch((err) => logger.error(err));

  if (!snapshot.empty) {
    const { start, expiry } = snapshot.docs[0].data();

    const currentDate = new Date();
    const startDate = start.toDate();
    const expiryDate = expiry.toDate();

    const numOfImages = 18;

    const timeDifference = expiryDate.getTime() - startDate.getTime();
    const daysAvailable = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const chunks = daysAvailable / numOfImages;

    const timeRemaining = expiryDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    const place = numOfImages - Math.ceil(daysRemaining / chunks) + 1;
    const numString = String(place).padStart(2, "0");

    const url = `${process.env.STORAGE_URL}/o/mrincredible_${numString}.png?alt=media`;
    const emojiNumbers = numberToEmoji(daysRemaining);

    const exampleEmbed = new MessageEmbed()
      .setColor(returnEmbedColor(place))
      .setTitle(
        `${daysRemaining === 1 ? "Queda" : "Quedan"} ${emojiNumbers} ${
          daysRemaining === 1 ? "día" : "días"
        } para la destrucción del server de minecraft.`
      )
      .setDescription(returnEmbedDescription(place))
      .setImage(url);

    await action(exampleEmbed);
  }
};

export default calculateServerExpiry;
