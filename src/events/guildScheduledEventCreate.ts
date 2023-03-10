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
    console.log(color('text', `π Event created ${color('variable', JSON.stringify(event))}`));

    const creator = event.client.users.cache.get(event.creatorId!) ?? (await event.client.users.fetch(event.creatorId!));
    console.log(color('text', `π¨ Event creator ${color('variable', JSON.stringify(creator))}`));

    const dmChannel = creator.dmChannel ?? (await creator.createDM());
    console.log(color('text', `π± Channel ${color('variable', JSON.stringify(dmChannel))}`));

    const botMember = event.guild!.members.cache!.get(event.client.user.id);
    const newsChannels = event
      .guild!.channels.cache!.filter(
        c => c.type == ChannelType.GuildAnnouncement && botMember?.permissionsIn(c)?.has(PermissionsBitField.Flags.SendMessages)
      )
      .map(c => c as NewsChannel);

    console.log(color('text', `π£ News channels ${color('variable', JSON.stringify(newsChannels))}`));

    if (newsChannels.length == 0) {
      console.log(color('text', `β No news channel found for guild ${color('variable', event.guildId)}`));
      return;
    }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`${GuildScheduledEventCreate_EventName}-${event.guildId}-${event.id}-channel`)
        .setPlaceholder('Choisis un salon !')
        .addOptions([
          {
            label: 'Aucun',
            description: 'Je ne veux pas crΓ©er de message',
            value: 'none',
          },
        ])
        .addOptions(
          newsChannels.map(c => ({
            label: c.name,
            emoji: 'π£',
            description: c.parent?.name,
            value: c.id,
          }))
        )
    );

    await dmChannel.send({
      content:
        'Hello ! \nJe suis le bot qui annonce automatiquement les Γ©vΓ©nements de la Toile Ludique Rennaise.\n Choisis dans quelle salon tu veux poster ton Γ©vΓ©nement et j\'y publierai une annonce et un fil de discussion.',
      components: [row],
    });
  },
  onInteraction: async (interaction: StringSelectMenuInteraction) => {
    console.log(color('text', `π Interaction ${color('variable', JSON.stringify(interaction))}`));

    const customIdParts = interaction.customId.split('-');
    if (customIdParts.length != 4) {
      console.log(color('text', `β Invalid customId ${color('variable', interaction.customId)}`));
      return;
    }

    const interactionId = customIdParts[0];
    if (interactionId != GuildScheduledEventCreate_EventName) {
      console.log(color('text', `β Invalid interactionId ${color('variable', interactionId)}`));
      return;
    }

    const guildId = interaction.customId.split('-')[1];
    const guild = interaction.client.guilds.cache.get(guildId) ?? (await interaction.client.guilds.fetch(guildId));
    if (guild == null) {
      console.log(color('text', `β Guild ${color('variable', guildId)} not found`));
      return;
    }
    console.log(color('text', `π¨βπ©βπ¦βπ¦ Guild ${color('variable', JSON.stringify(guild))}`));

    const destChannelId = interaction.values.length > 0 && interaction.values[0] != 'none' ? interaction.values[0] : null;
    if (destChannelId == null) {
      console.log(color('text', 'β No channel selected'));
      return;
    }

    const destChannel = guild.channels.cache.get(destChannelId) ?? (await guild.channels.fetch(destChannelId));
    console.log(color('text', `π± Destination channel ${color('variable', JSON.stringify(destChannel))}`));

    const eventId = interaction.customId.split('-')[2];
    const event = guild.scheduledEvents.cache.get(eventId) ?? (await guild.scheduledEvents.fetch(eventId));
    if (event == null) {
      console.log(color('text', `β Event ${color('variable', eventId)} not found`));
      return;
    }

    if (!(destChannel instanceof BaseGuildTextChannel)) {
      return;
    }

    const message = await destChannel.send(
      `Un nouvel Γ©vΓ©nement vient d'Γͺtre crΓ©Γ© !\n Clique ici pour le voir et n'hΓ©site pas Γ  dire que tu es intΓ©ressΓ© : ${event.url}`
    );
    console.log(color('text', `π© Message crΓ©Γ© ${color('variable', JSON.stringify(message))}`));

    const thread = await message.startThread({ name: event.name, reason: `CrΓ©ation d'un thread pour l'Γ©vΓ©nement ${event.name}` });
    await thread.send('Voici le fil de discussion pour l\'Γ©vΓ©nement !');
    console.log(color('text', `π§Ά Thread crΓ©Γ© ${color('variable', JSON.stringify(thread))}`));
  },
};

export default event;
