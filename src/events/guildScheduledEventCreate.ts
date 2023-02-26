import {
  ActionRowBuilder,
  BaseGuildTextChannel,
  ChannelType,
  GuildScheduledEvent,
  NewsChannel,
  PermissionsBitField,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { color } from '../functions';
import { BotEvent } from '../types';

const GuildScheduledEventCreate_EventName = 'guildScheduledEventCreate';

const event: BotEvent = {
  name: GuildScheduledEventCreate_EventName,
  execute: async (event: GuildScheduledEvent) => {
    console.log(color('text', `📅 Event created ${color('variable', JSON.stringify(event))}`));

    const creator = event.client.users.cache.get(event.creatorId!) ?? (await event.client.users.fetch(event.creatorId!));
    console.log(color('text', `👨 Event creator ${color('variable', JSON.stringify(creator))}`));

    const dmChannel = creator.dmChannel ?? (await creator.createDM());
    console.log(color('text', `💱 Channel ${color('variable', JSON.stringify(dmChannel))}`));

    const botMember = event.guild!.members.cache!.get(event.client.user.id);
    const newsChannels = event
      .guild!.channels.cache!.filter(
        c => c.type == ChannelType.GuildAnnouncement && botMember?.permissionsIn(c)?.has(PermissionsBitField.Flags.SendMessages)
      )
      .map(c => c as NewsChannel);

    console.log(color('text', `📣 News channels ${color('variable', JSON.stringify(newsChannels))}`));

    if (newsChannels.length == 0) {
      console.log(color('text', `❌ No news channel found for guild ${color('variable', event.guildId)}`));
      return;
    }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`${GuildScheduledEventCreate_EventName}-${event.guildId}-${event.id}-channel`)
        .setPlaceholder('Choisis un salon !')
        .addOptions([
          {
            label: 'Aucun',
            description: 'Je ne veux pas créer de message',
            value: 'none',
          },
        ])
        .addOptions(
          newsChannels.map(c => ({
            label: c.name,
            emoji: '📣',
            description: c.parent?.name,
            value: c.id,
          }))
        )
    );

    await dmChannel.send({
      content:
        'Hello ! \nJe suis le bot qui annonce automatiquement les événements de la Toile Ludique Rennaise.\n Choisis dans quelle salon tu veux poster ton événement et j\'y publierai une annonce et un fil de discussion.',
      components: [row],
    });
  },
  onInteraction: async (interaction: StringSelectMenuInteraction) => {
    console.log(color('text', `👇 Interaction ${color('variable', JSON.stringify(interaction))}`));

    const customIdParts = interaction.customId.split('-');
    if (customIdParts.length != 4) {
      console.log(color('text', `❌ Invalid customId ${color('variable', interaction.customId)}`));
      return;
    }

    const interactionId = customIdParts[0];
    if (interactionId != GuildScheduledEventCreate_EventName) {
      console.log(color('text', `❌ Invalid interactionId ${color('variable', interactionId)}`));
      return;
    }

    const guildId = interaction.customId.split('-')[1];
    const guild = interaction.client.guilds.cache.get(guildId) ?? (await interaction.client.guilds.fetch(guildId));
    if (guild == null) {
      console.log(color('text', `❌ Guild ${color('variable', guildId)} not found`));
      return;
    }
    console.log(color('text', `👨‍👩‍👦‍👦 Guild ${color('variable', JSON.stringify(guild))}`));

    const destChannelId = interaction.values.length > 0 && interaction.values[0] != 'none' ? interaction.values[0] : null;
    if (destChannelId == null) {
      console.log(color('text', '❌ No channel selected'));
      return;
    }

    const destChannel = guild.channels.cache.get(destChannelId) ?? (await guild.channels.fetch(destChannelId));
    console.log(color('text', `💱 Destination channel ${color('variable', JSON.stringify(destChannel))}`));

    const eventId = interaction.customId.split('-')[2];
    const event = guild.scheduledEvents.cache.get(eventId) ?? (await guild.scheduledEvents.fetch(eventId));
    if (event == null) {
      console.log(color('text', `❌ Event ${color('variable', eventId)} not found`));
      return;
    }

    if (!(destChannel instanceof BaseGuildTextChannel)) {
      return;
    }

    const message = await destChannel.send(
      `Un nouvel événement vient d'être créé !\n Clique ici pour le voir et n'hésite pas à dire que tu es intéressé : ${event.url}`
    );
    console.log(color('text', `📩 Message créé ${color('variable', JSON.stringify(message))}`));

    const thread = await message.startThread({ name: event.name, reason: `Création d'un thread pour l'événement ${event.name}` });
    await thread.send('Voici le fil de discussion pour l\'événement !');
    console.log(color('text', `🧶 Thread créé ${color('variable', JSON.stringify(thread))}`));
  },
};

export default event;
