import { BaseGuildTextChannel, DMChannel, GuildScheduledEvent } from "discord.js";
import { color } from "../functions";
import { BotEvent } from "../types";
import ListPrompt from "../utils/prompts/list-prompts";
import { guilds } from "../utils/guilds.json";

const event: BotEvent = {
    name: "guildScheduledEventCreate",
    execute: async (event: GuildScheduledEvent) => {
        console.log(color("text", `📅 Event created ${color("variable", JSON.stringify(event))}`));

        const creator = event.client.users.cache.get(event.creatorId!) ?? await event.client.users.fetch(event.creatorId!);
        console.log(color("text", `👨 Event creator ${color("variable", JSON.stringify(creator))}`));

        const channel = creator.dmChannel ?? await creator.createDM();
        console.log(color("text", `💱 Channel ${color("variable", JSON.stringify(channel))}`));

        const destChannelId = await promptChannel(channel, event.creatorId!, event.guildId!);
        if (destChannelId == null) return;

        const destChannel = event.guild!.channels.cache.get(destChannelId) ?? await event.guild?.channels.fetch(destChannelId);
        console.log(color("text", `💱 Destination channel ${color("variable", JSON.stringify(destChannel))}`));

        if (!(destChannel instanceof BaseGuildTextChannel)) return;

        const message = await destChannel.send(`Un nouvel événement vient d'être créé !\n Clique ici pour le voir et n'hésite pas à dire que tu es intéressé : ${event.url}`);
        console.log(color("text", `📩 Message créé ${color("variable", JSON.stringify(message))}`));

        const thread = await message.startThread({ name: event.name, reason: `Création d'un thread pour l'événement ${event.name}` });
        await thread.send('Voici le fil de discussion pour l\'événement !');
        console.log(color("text", `🧶 Thread créé ${color("variable", JSON.stringify(thread))}`));


        console.log(color("text", `👌 Done !`));

    }
};

export default event;

async function promptChannel(channel: DMChannel, creatorId: string, guildId: string): Promise<string | null> {
    try {

        const channels = guilds.find(g => g.id == guildId)?.channels ?? [];
        if (channels.length == 0) {
            console.log(color("text", `❌ No channel found for guild ${color("variable", guildId)}`));
            return null;
        }

        const reaction = await ListPrompt.singleReactionPicker({
            prompt: 'Hello ! \nJe suis le bot qui annonce automatiquement les événements de la Toile Ludique Rennaise.\n Choisis dans quelle salon tu veux poster ton événement et j\'y créerai un message et un fil de discussion.',
            channel: channel,
            userId: creatorId,
            time: 60
        }, channels);

        if (!reaction) {
            console.log(color("text", `❌ ${color("error", "No reaction")}`));
            return null;
        }

        console.log(color("text", `${reaction.emojiName} Reaction ${color("variable", JSON.stringify(reaction))}`));

        return channels.find(c => c.emojiName == reaction.emojiName)!.id;
    } catch (error) {
        if (error.name == 'TimeOutError') {
            // the user timed out
            console.log(color("text", `❌ ${color("error", "Time out")}`));
        }

        return null;
    }
}

