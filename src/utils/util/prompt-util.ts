import PromptInfo from "../models/PromptInfo";

/**
 * Creates the prompt out of the promptInfo data.
 * @param {PromptInfo} promptInfo
 * @returns {String}
 */
export function createPrompt({ prompt, time = Infinity }: PromptInfo): string {
    let finalPrompt = `${prompt}`;
    if (time !== Infinity) finalPrompt = `${finalPrompt} \n* Tu as ${time} secondes pour répondre.`;

    return finalPrompt;
}

/**
 * Validates the prompt info and returns the validated object.
 * @param {PromptInfo} promptInfo 
 * @returns {PromptInfo}
 * @throws Errors if the information is not valid!
 */
export function validatePromptInfo(promptInfo: PromptInfo): PromptInfo {
    if (!promptInfo?.prompt) throw new Error('You must give a prompt the prompt string!');
    if (!promptInfo?.channel) throw new Error('You must give a prompt the channel to send the prompt on!');
    if (promptInfo.channel.type !== 'GUILD_TEXT' && promptInfo.channel.type !== 'DM') throw new Error('The prompt channel must be a text or DM channel!');
    if (!promptInfo?.userId) throw new Error('You must give a prompt the user id to tag the user who must respond.');
    if (!promptInfo?.time) promptInfo.time = Infinity;
    if (!promptInfo?.cancelable) promptInfo.cancelable = false;
    return { ...promptInfo };
}
