import { config } from 'dotenv';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { BotEvent, Command, SlashCommand } from './types';
import { readdirSync } from 'fs';
import { join } from 'path';
import { initApp } from './app';

config();

initApp();

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.Guilds,
  ],
});
client.events = new Collection<string, BotEvent>();
client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, './handlers');
readdirSync(handlersDir).forEach(handler => {
  require(`${handlersDir}/${handler}`)(client);
});

client.login(process.env.TOKEN);
