import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
dotenv.config();

import commands from "../commands/index";
import logger from "../utils/logger";

const clientId = process.env.DISCORD_CLIENT_ID || "";
const guildId = process.env.GUILD_ID || "";
const token = process.env.DISCORD_TOKEN || "";

const commandList = commands.map((command) => command.data.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commandList,
  })
  .then(() => logger.info("Successfully registered application commands."))
  .catch(logger.error);
