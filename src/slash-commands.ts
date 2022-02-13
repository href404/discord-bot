import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
import { commands } from "./commands";

dotenv.config();

const { DISCORD_API_KEY, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;
if (DISCORD_API_KEY == undefined) process.exit(1);

const rest = new REST({ version: "9" }).setToken(DISCORD_API_KEY);

async function updateSlashCommands() {
    console.log("Started refreshing application (/) commands.");

    if (DISCORD_CLIENT_ID == undefined || DISCORD_GUILD_ID == undefined) return;

    const uri = Routes.applicationGuildCommands(
        DISCORD_CLIENT_ID,
        DISCORD_GUILD_ID
    );
    const guildCommands = await rest.get(uri);
    console.log(guildCommands);

    const options = { body: commands };
    await rest.put(uri, options);

    console.log("Successfully reloaded application (/) commands.");
}

updateSlashCommands();