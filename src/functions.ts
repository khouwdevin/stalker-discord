import chalk from "chalk"
import { Channel, ChannelManager, ChannelType, Guild, GuildMember, Message, PermissionFlagsBits, PermissionResolvable, TextChannel } from "discord.js"
import GuildDB from "./schemas/Guild"
import { GuildOption } from "./types"
import mongoose from "mongoose";

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}

export const sendMessage = (message: string, channel: TextChannel) => {
    channel.send(message)
}

export const sendMessageToSpesificChannel = async (message: string, channelname: string, channels: ChannelManager) => {
    let channelid = ""
    channels.cache.forEach((channel) => {
        if (channel.type === ChannelType.GuildText && (channel as TextChannel).name === channelname) {
            channelid = channel.id
        }   
    })

    if (channelid.length > 0) {
        (await channels.fetch(channelid) as TextChannel).send(message)
    }
    else {
        channels.cache.forEach((channel) => {
            if (channel.type === ChannelType.GuildText) {
                channel.send(`${process.env.STALKER_CHANNEL} channel isn't found! Please create one!`)
                    .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), 4000))
            }
        })
    }
}

export const sendTimedMessageToSpesificChannel = async (message: string, channelname: string, duration: number, channels: ChannelManager) => {
    let channelid = ""
    channels.cache.forEach((channel) => {
        if (channel.type === ChannelType.GuildText && (channel as TextChannel).name === channelname) {
            channelid = channel.id
        }   
    })

    if (channelid.length > 0) {
        const channel = await channels.fetch(channelid) as TextChannel

        channel.send(message)
            .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    }
    else {
        channels.cache.forEach((channel) => {
            if (channel.type === ChannelType.GuildText) {
                channel.send(`${process.env.STALKER_CHANNEL} channel isn't found! Please create one!`)
                    .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), 4000))
            }
        })
    }
}

export const deleteTimedMessage = (message: Message<true> | Message<false>, channel: TextChannel, duration: number) => {
    setTimeout(
        async () => (await channel.messages.fetch(message)).delete(), duration
    )
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options[option]
}

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    foundGuild.options[option] = value
    foundGuild.save()
}

export const getChannelIdbyName = (channels: ChannelManager, name: string): Promise<string> => {
    let id = ""
    channels.cache.forEach((channel) => {
        if ((channel as TextChannel).name === name)
            id = channel.id
    })

    return Promise.resolve(id)
}

export const getCurrentGuildbySendMessage = async (channels: ChannelManager): Promise<Guild | null | undefined> => {
    for (let i = 0; i < channels.cache.size; i++) {
        let channelGuild = channels.cache.at(i)

        if (channelGuild?.type === ChannelType.GuildText) {
            const channel = channelGuild.guild.systemChannel
            const guild = channelGuild.guild

            channel?.send("Stalker is back online!").then(m => setTimeout(() => m.delete(), 5000))
            return Promise.resolve(guild)
        }       
    }
}