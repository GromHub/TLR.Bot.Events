import { GuildScheduledEvent, BaseGuildTextChannel, ChannelType } from 'discord.js';
import { color, searchEventMessage } from '../functions';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildScheduledEventUpdate',
  execute: async (oldEvent: GuildScheduledEvent, newEvent: GuildScheduledEvent) => {
    console.log(color('text', `📅 Event updated ${color('variable', `${JSON.stringify(oldEvent)}\n${JSON.stringify(newEvent)}`)}`));

    if (oldEvent.name === newEvent.name) {
      return;
    }

    const message = await searchEventMessage(
      oldEvent.guild!.channels.cache.filter(c => c.type == ChannelType.GuildAnnouncement).map(c => c.id),
      oldEvent.client,
      oldEvent.url
    );

    if (message == null) {
      console.log(color('text', `❌ No message found for event ${color('variable', oldEvent.url)}`));
      return;
    }

    await message.thread?.edit({ name: newEvent.name, reason: 'Event name changed' });
    console.log(color('text', `🖊 Event message updated ${color('variable', JSON.stringify(message))}`));

    console.log(color('text', '👌 Done !'));
  },
};

export default event;
