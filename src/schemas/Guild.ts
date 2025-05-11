import mongoose, { Schema } from 'mongoose'
import { IGuild } from '../types'

const GuildSchema = new Schema<IGuild>({
  guildID: { required: true, type: String },
  guildName: { required: true, type: String },
  options: {
    detectpresence: { type: Boolean, default: false },
    notify: { type: Boolean, default: false },
    channel: { type: String, default: 'default' },
  },
})

const db = mongoose.connection.useDb(process.env.MONGO_DATABASE_NAME)
const GuildModel = db.model('guild', GuildSchema, 'guilds')

export default GuildModel
