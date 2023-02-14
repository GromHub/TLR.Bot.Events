import { GuildScheduledEvent, BaseGuildTextChannel } from "discord.js";
import { color } from "../functions";
import { BotEvent } from "../types";
import { guilds } from "../utils/guilds.json";

const event: BotEvent = {
    name: "guildScheduledEventDelete",
    execute: async (event: GuildScheduledEvent) => {
        console.log(color("text", `📅 Event deleted ${color("variable", JSON.stringify(event))}`));

        const channels = guilds.find(g => g.id == event.guildId)?.channels ?? [];
        if (channels.length == 0) {
            console.log(color("text", `❌ No channel found for guild ${color("variable", event.guildId)}`));
            return;
        }

        for (const guildChannel of channels) {
            const channel = event.client.channels.cache.get(guildChannel.id) ?? (await event.client.channels.fetch(guildChannel.id));
            if (!(channel instanceof BaseGuildTextChannel))
                continue;

            const messages = await channel.messages.fetch();
            const message = messages.find(message => message.content.includes(event.url));
            if (message == null)
                continue;

            await message.delete();
            await message.thread?.delete();
            console.log(color("text", `❌ Event message deleted ${color("variable", JSON.stringify(message))}`));
            break;
        }

        console.log(color("text", `👌 Done !`));
    }
};

export default event;
