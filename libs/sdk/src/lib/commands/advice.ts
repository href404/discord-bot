import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import { ChatCommand } from '../models/command';
import { ClientConfiguration } from '../models/configuration';

export class Advice implements ChatCommand {
  name = 'advice';
  description = 'Get a random advice';

  constructor(private configuration: ClientConfiguration) {}

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const advice = await getAdvice(this.configuration);

    const embed = new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(`🔮 ${advice}`);

    await interaction.followUp({ ephemeral: true, embeds: [embed] });
  }
}

async function getAdvice(configuration: ClientConfiguration) {
  const response = await axios.get(configuration.adviceServiceUrl);
  return response.data.slip.advice;
}
