import { Interaction, StringSelectMenuInteraction } from 'discord.js';
import { color } from '../functions';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      let command = interaction.client.slashCommands.get(interaction.commandName);
      if (!command) {
        return;
      }
      let cooldown = interaction.client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`);
      if (command.cooldown && cooldown) {
        if (Date.now() < cooldown) {
          interaction.reply(`You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`);
          setTimeout(() => interaction.deleteReply(), 5000);
          return;
        }
        interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000);
        setTimeout(() => {
          interaction.client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`);
        }, command.cooldown * 1000);
      } else if (command.cooldown && !cooldown) {
        interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000);
      }
      command.execute(interaction);
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.slashCommands.get(interaction.commandName);
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      try {
        if (command.autocomplete) {
          command.autocomplete(interaction);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isStringSelectMenu()) {
      const menuInteraction = interaction as StringSelectMenuInteraction;

      const eventName = menuInteraction.customId.split('-')[0];

      const event = interaction.client.events.get(eventName);
      if (!event) {
        console.error(`No event matching ${eventName} was found.`);
        return;
      }

      try {
        if (event.onInteraction) {
          await interaction.deferReply({ ephemeral: true });

          await event.onInteraction(interaction!);

          await interaction.editReply({ content: '👌 C\'est fait !' });

          await interaction.message.delete();

          console.log(color('text', '👌 Done !'));
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
};

export default event;
