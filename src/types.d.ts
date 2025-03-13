import {
  SlashCommandBuilder,
  CommandInteraction,
  Collection,
  PermissionResolvable,
  Message,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  APIEmbedField,
  EmbedFooterOptions,
} from 'discord.js'
import { Player, MoonlinkEvents, Manager, TPlayerLoop } from 'moonlink.js'
import mongoose from 'mongoose'
import { Logger } from 'pino'

export interface SlashCommand {
  command: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
  modal?: (interaction: ModalSubmitInteraction) => void
  button?: (interaction: ButtonInteraction) => void
  autocomplete?: (interaction: AutocompleteInteraction) => void
  cooldown?: number // in seconds
}

export interface Command {
  name: string
  execute: (message: Message, args: Array<string>) => void
  button?: (interaction: ButtonInteraction) => void
  permissions: Array<PermissionResolvable>
  aliases: Array<string>
  cooldown?: number
}

interface GuildOptions {
  notify: Boolean
  detectpresence: Boolean
  channel: String
}

interface PlayerOptions {
  autoPlay: Boolean
  loop: TPlayerLoop
  volume: Number
  shuffle: Boolean
}

export interface IGuild extends mongoose.Document {
  guildID: string
  options: GuildOptions
  joinedAt: Date
}

export interface IPoll extends mongoose.Document {
  guildID: string
  messageID: string
  pollResult: number[]
  usersID: string[]
}

export interface IPlayer extends mongoose.Document {
  guildId: string
  options: PlayerOptions
}

export type GuildOption = keyof GuildOptions
export type PlayerOption = keyof PlayerOptions

export interface BotEvent {
  name: string
  once?: boolean | false
  execute: (...args) => void
}

export interface MoonEvent {
  name: keyof MoonlinkEvents
  execute: (...args) => void
}

export interface IHelp {
  title: string
  field: APIEmbedField[]
  footer: EmbedFooterOptions
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string
      CLIENT_ID: string
      MY_ID: string
      PREFIX_COMMAND: string
      MONGO_URI: string
      MONGO_DATABASE_NAME: string
      STALKER_DATABASE: string
      LAVALINK_PASSWORD: string
      LAVALINK_PORT: string
      LAVALINK_HOST: string
      LAVALINK_IDENTIFIER: string
      SPOTIFY_CLIENTID: string
      SPOTIFY_CLIENT_SECRET: string
      TURN_ON_MUSIC: string
    }
  }
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>
    commands: Collection<string, Command>
    cooldowns: Collection<string, number>
    timeouts: Collection<string, NodeJS.Timeout>
    playerAttempts: Collection<string, number>
    moon: Manager
  }
}
