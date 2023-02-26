import { ChannelType, GuildScheduledEvent, User } from 'discord.js';
import { color, searchEventMessage } from '../functions';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildScheduledEventUserAdd',
  execute: async (event: GuildScheduledEvent, user: User) => {
    console.log(color('text', `🙍‍♂️📅 A member subscribes to an event ${color('variable', JSON.stringify(event))}`));

    const message = await searchEventMessage(
      event.guild!.channels.cache.filter(c => c.type == ChannelType.GuildAnnouncement).map(c => c.id),
      event.client,
      event.url
    );

    if (message == null) {
      console.log(color('text', `❌ No message found for event ${color('variable', event.url)}`));
      return;
    }

    message?.thread?.members.add(user);

    console.log(color('text', '👌 Done !'));
  },
};

export default event;
