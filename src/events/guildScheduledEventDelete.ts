import { ChannelType, GuildScheduledEvent } from 'discord.js';
import { color, searchEventMessage } from '../functions';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildScheduledEventDelete',
  execute: async (event: GuildScheduledEvent) => {
    console.log(color('text', `📅 Event deleted ${color('variable', JSON.stringify(event))}`));

    const message = await searchEventMessage(
      event.guild!.channels.cache.filter(c => c.type == ChannelType.GuildAnnouncement).map(c => c.id),
      event.client,
      event.url
    );

    if (message == null) {
      console.log(color('text', `❌ No message found for event ${color('variable', event.url)}`));
      return;
    }

    await message.delete();
    await message.thread?.delete();
    console.log(color('text', `🚮 Event message and thread deleted ${color('variable', JSON.stringify(message))}`));

    console.log(color('text', '👌 Done !'));

    event;
  },
};

export default event;
