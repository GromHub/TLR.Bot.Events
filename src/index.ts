import { config } from "dotenv";
config();

import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

import { Client, Intents, Collection, } from "discord.js";
import { Command, SlashCommand } from "./types";
import { readdirSync } from "fs";
import { join } from "path";

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
    ]
});
client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach(handler => {
    require(`${handlersDir}/${handler}`)(client);
});

client.login(process.env.TOKEN);