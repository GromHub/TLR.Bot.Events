import { Message, BaseGuildTextChannel, DMChannel } from 'discord.js';

/**
 * Sends a message to a user via a channel. The user is mentioned.
 * @param {BaseGuildTextChannel | DMChannel} channel
 * @param {String} userId
 * @param {String} msgText
 * @returns {Promise<Message>}
 */
export async function channelMsg(channel: BaseGuildTextChannel | DMChannel, userId: string, msgText: string): Promise<Message> {
  return await channel.send(`<@${userId}> ${msgText}`);
}

/**
 * Sends a message to a user via a channel. Message is removed after a time out.
 * @param {BaseGuildTextChannel | DMChannel} channel
 * @param {String} userId
 * @param {String} msgText
 * @param {Number} time - time to wait to delete message, in seconds
 */
export async function channelMsgDelete(channel: BaseGuildTextChannel | DMChannel, userId: string, msgText: string, time: number) {
  let msg = await channelMsg(channel, userId, msgText);
  setTimeout(() => msg.delete(), time * 1000);
}
