import mongoose from 'mongoose'
import { Client } from 'discord.js'
import logger from '../logger'

module.exports = (client: Client) => {
  initalizeMongoDB(client)
}

const initalizeMongoDB = (client: Client) => {
  if (!process.env.MONGO_USERNAME || !process.env.MONGO_PASSWORD)
    return logger.error(
      '[Handler] : 🍃 Mongo username or mongo password is not found, skipping',
    )

  mongoose
    .connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE_NAME}`,
    )
    .then(() => {
      logger.info('[Handler] : 🍃 MongoDB connection has been established')
    })
    .catch(() => {
      logger.error('[Handler] : ❌ MongoDB connection has been failed')
      setTimeout(() => {
        logger.info('[Handler] : 🍃 Try reconnecting to MongoDB')
        initalizeMongoDB(client)
      }, 5000)
    })
}
