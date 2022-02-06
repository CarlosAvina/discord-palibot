import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
dotenv.config();

import ping from "../commands/ping.js";
import serverInfo from "../commands/serverInfo.js";
import userInfo from "../commands/userInfo.js";
import question from "../commands/question.js";
import minecraft from "../commands/minecraft.js";

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [ping, serverInfo, userInfo, question, minecraft.data].map(
  (command) => command.toJSON()
);

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
