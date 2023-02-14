import chalk from "chalk";
import { GuildMember, PermissionResolvable, BaseGuildTextChannel } from "discord.js";

type colorType = "text" | "variable" | "error";

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
};

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`);

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message);
};

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = [];
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission);
    });
    if (neededPermissions.length === 0) return null;
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ");
        else return Object.keys(BigInt).find(k => Object(BigInt)[k] === p)?.split(/(?=[A-Z])/).join(" ");
    });
};

export const sendTimedMessage = (message: string, channel: BaseGuildTextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m.content)).delete(), duration));
    return;
};

export interface Dictionary<Type> {
    [key: string]: Type;
}