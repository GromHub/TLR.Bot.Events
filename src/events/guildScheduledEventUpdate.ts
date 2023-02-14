import { GuildScheduledEvent, BaseGuildTextChannel } from "discord.js";
import { color } from "../functions";
import { BotEvent } from "../types";
import { guilds } from "../utils/guilds.json";

const event: BotEvent = {
    name: "guildScheduledEventUpdate",
    execute: async (oldEvent: GuildScheduledEvent, newEvent: GuildScheduledEvent) => {
        console.log(color("text", `📅 Event updated ${color("variable", `${JSON.stringify(oldEvent)}\n${JSON.stringify(newEvent)}`)}`));

        if (oldEvent.name === newEvent.name) return;

        const channels = guilds.find(g => g.id == oldEvent.guildId)?.channels ?? [];
        if (channels.length == 0) {
            console.log(color("text", `❌ No channel found for guild ${color("variable", oldEvent.guildId)}`));
            return;
        }

        for (const guildChannel of channels) {
            const channel = oldEvent.client.channels.cache.get(guildChannel.id) ?? (await oldEvent.client.channels.fetch(guildChannel.id));
            if (!(channel instanceof BaseGuildTextChannel)) continue;

            const messages = await channel.messages.fetch();
            const message = messages.find(message => message.content.includes(oldEvent.url));
            if (message == null) continue;

            await message.thread?.edit({ name: newEvent.name }, "Event name changed");
            console.log(color("text", `🖊 Event message updated ${color("variable", JSON.stringify(message))}`));
        }

        console.log(color("text", `👌 Done !`));
    }
};

export default event;
