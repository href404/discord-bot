import { Client } from "discord.js";
import { chatCommands, userCommands } from "../commands";

export async function ready(client: Client) {
    if (!client.user || !client.application) return;

    // const guildCommands = await client.application.commands.fetch();
    // guildCommands.forEach((c) => c.delete());

    await client.application.commands.set([...chatCommands, ...userCommands]);
    console.log(`${client.user.username} is online`);
}