import { EmbedBuilder } from 'discord.js';
import { TimeOutError } from '../errors';
import { PickerOption } from '../models/PickerOption';
import { PromptInfo } from '../models/PromptInfo';
import { channelMsgDelete } from '../util/discord-util';
import { validatePromptInfo, createPrompt } from '../util/prompt-util';

export default class ListPrompt {
  static async singleReactionPicker(promptInfo: PromptInfo, options: PickerOption[]): Promise<PickerOption> {
    let optionList = await ListPrompt.multiReactionPicker(promptInfo, options, 1);
    return optionList[0];
  }

  static async multiReactionPicker(promptInfo: PromptInfo, options: PickerOption[], amount: number): Promise<PickerOption[]> {
    promptInfo = validatePromptInfo(promptInfo);
    promptInfo.cancelable = false;
    promptInfo.prompt = `${promptInfo.prompt} \n* Réagis à ce message avec un des emojis pour sélectionner le bon salon !`;

    const embed = new EmbedBuilder()
      .setTitle('Nouvel événement : choisis un salon pour l\'annoncer !')
      .setFooter({
        text: 'Merci à toi ! L\'équipe de la Toile Ludique Rennaise',
        iconURL: 'https://cdn.discordapp.com/icons/1047083525414866977/633e7cd4b0952e790be0e94478474bbd.webp',
      }      )
      .setDescription(createPrompt(promptInfo))
      .addFields(options.map(option => ({ name: option.emojiName, value: option.description, inline: true })));

    const msg = await promptInfo.channel.send({ content: `<@${promptInfo.userId}>`, embeds: [embed] });

    for (const option of options) {
      await msg.react(option.emojiName);
    }

    try {
      var emojiResponses = await msg.awaitReactions({
        filter: (reaction, user) => !user.bot && user.id === promptInfo.userId && options.some(option => option.emojiName === reaction.emoji.name),
        max: amount,
        time: promptInfo.time == Infinity ? undefined : (promptInfo.time ?? 60) * 1000,
        errors: ['time'],
      });
      return options.filter(option => emojiResponses.find(reaction => reaction.emoji.name === option.emojiName));
    } catch (error) {
      if (error.name == 'time') {
        await channelMsgDelete(promptInfo.channel, promptInfo.userId, 'Le temps est écoulé ! J\'ignore la création du message', 10);
        throw new TimeOutError();
      } else {
        throw error;
      }
    } finally {
      await msg.delete();
    }
  }
}
