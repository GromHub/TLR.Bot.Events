import { BaseGuildTextChannel, DMChannel } from 'discord.js';

/**
 * Common data for all prompts.
 */

export interface PromptInfo {
  prompt: string;
  channel: BaseGuildTextChannel | DMChannel;
  userId: string;
  time?: number;
  cancelable?: boolean;
}
