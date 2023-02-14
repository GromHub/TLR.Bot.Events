import { BaseGuildTextChannel, DMChannel } from 'discord.js';

/**
 * Common data for all prompts.
 */

export default interface PromptInfo {
    prompt: string;
    channel: BaseGuildTextChannel | DMChannel;
    userId: string;
    time?: number;
    cancelable?: boolean;
}
