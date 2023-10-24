import chalk from "chalk"
import { Channel, ChannelManager, ChannelType, Client, Guild, GuildMember, Message, PermissionFlagsBits, PermissionResolvable, TextChannel } from "discord.js"
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
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete().catch((e) => {console.log(e.message)}), duration))
    return
}

export const sendMessage = (message: string, channel: TextChannel) => {
    channel.send(message)
}

export const sendMessageToSpesificChannel = async (message: string, channelname: string, channels: ChannelManager) => {
    let channelid = ""

    for (let i = 0; i < channels.cache.size; i++) {
        const channel = channels.cache.at(i) as Channel

        if (channel.type === ChannelType.GuildText && (channel as TextChannel).name === channelname) {
            channelid = channel.id

            break
        }   
    }

    if (channelid.length > 0) {
        (await channels.fetch(channelid) as TextChannel).send(message)
    }
    else {
        for (let i = 0; i < channels.cache.size; i++){
            const channelGuild = channels.cache.at(i)

            if (channelGuild?.type === ChannelType.GuildText) {
                const channel = channelGuild.guild.systemChannel ? channelGuild.guild.systemChannel : channelGuild
                channel.send(`${channelname} channel isn't found! Please create one!`)

                break
            }
        }
    }
}

export const sendTimedMessageToSpesificChannel = async (message: string, channelname: string, duration: number, channels: ChannelManager) => {
    let channelid = ""
    
    for (let i = 0; i < channels.cache.size; i++) {
        const channel = channels.cache.at(i) as Channel

        if (channel.type === ChannelType.GuildText && (channel as TextChannel).name === channelname) {
            channelid = channel.id

            break
        }   
    }

    if (channelid.length > 0) {
        const channel = await channels.fetch(channelid) as TextChannel

        channel.send(message)
            .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete().catch((e) => {console.log(e.message)}), duration))
    }
    else {
        for (let i = 0; i < channels.cache.size; i++){
            const channelGuild = channels.cache.at(i)

            if (channelGuild?.type === ChannelType.GuildText) {
                const channel = channelGuild.guild.systemChannel ? channelGuild.guild.systemChannel : channelGuild
                channel.send(`${channelname} channel isn't found! Please create one!`)
                    .then(m => {setTimeout(async () => (await channel.messages.fetch(m)).delete().catch((e) => {console.log(e.message)}), 4000)})

                break
            }
        }
    }
}

export const deleteTimedMessage = (message: Message, channel: TextChannel, duration: number) => {
    setTimeout(
        async () => {
            (await channel.messages.fetch(message)).delete().catch((e) => {console.log(e.message)})
        }
    , duration)
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options[option]
}

export const getAllGuildOption = async (guild: Guild) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options
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

export const sendNotifyStalkerOnline = async (client: Client) => {
    const guildsList: Guild[] = []
    const channelList: TextChannel[] = []
    const guilds = client.guilds.cache

    for (let i = 0; i < guilds.size; i++) {
        if (guildsList.includes(guilds.at(i) as Guild)) {
            guildsList.push(guilds.at(i) as Guild)
            const guild = guilds.at(i) as Guild
            const channels =  guild.channels.cache

            for (let j = 0; i < channels.size; i++) {
                if (channels.at(j)?.type === ChannelType.GuildText) {
                    channelList.push(channels.at(j) as TextChannel)

                    break
                }
            }
        }        
    }
    
    for (let i = 0; i < guildsList.length; i++) {
        const guild = guildsList.at(i) as Guild
        const channelGuild = channelList.at(i)

        const notify = await getGuildOption(guild, "notify")

        if (notify) {
            if (channelGuild) {
                const channel = guild.systemChannel ? guild.systemChannel : channelGuild
                channel.send("Stalker is back online!").then(m => setTimeout(() => m.delete().catch((e) => {console.log(e.message)}), 5000))
            }
        }
    }
}

export const getDateChoices = (): Array<string> => {
    const result: Array<string> = []

    for (let i = 0; i < 8; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)

        const thedate = date.toDateString().split(" ")
        const formateddate = `${thedate[2]} ${thedate[1]} ${thedate[3]}`

        result.push(formateddate)
    }

    return result
}

export const getTimeChoices = (): Array<string> => {
    const result: Array<string> = []

    for (let i = 1; i < 13; i++) {
        if (i < 10) {
            result.push(`0${i}:00`)
        }
        else {
            result.push(`${i}:00`)
        }
    }

    return result
}