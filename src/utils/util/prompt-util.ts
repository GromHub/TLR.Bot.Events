import { ChannelType } from 'discord.js';
import { PromptInfo } from '../models/PromptInfo';

/**
 * Creates the prompt out of the promptInfo data.
 * @param {PromptInfo} promptInfo
 * @returns {String}
 */
export function createPrompt({ prompt, time = Infinity }: PromptInfo): string {
  return prompt + (time !== Infinity ? `\n* Tu as ${time} secondes pour répondre.` : '');
}

/**
 * Validates the prompt info and returns the validated object.
 * @param {PromptInfo} promptInfo
 * @returns {PromptInfo}
 * @throws Errors if the information is not valid!
 */
export function validatePromptInfo(promptInfo: PromptInfo): PromptInfo {
  if (!promptInfo?.prompt) {
    throw new Error('You must give a prompt the prompt string!');
  }

  if (!promptInfo?.channel) {
    throw new Error('You must give a prompt the channel to send the prompt on!');
  }

  if (promptInfo.channel.type !== ChannelType.GuildText && promptInfo.channel.type !== ChannelType.DM) {
    throw new Error('The prompt channel must be a text or DM channel!');
  }

  if (!promptInfo?.userId) {
    throw new Error('You must give a prompt the user id to tag the user who must respond.');
  }

  if (!promptInfo?.time) {
    promptInfo.time = Infinity;
  }

  if (!promptInfo?.cancelable) {
    promptInfo.cancelable = false;
  }

  return { ...promptInfo };
}
