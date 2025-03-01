import mongoose from 'mongoose'
import { color } from '../functions'

module.exports = () => {
  initalizeMongoDB()
}

const initalizeMongoDB = () => {
  if (!process.env.MONGO_URI)
    return console.log(
      color('text', `🍃 Mongo URI not found, ${color('error', 'skipping')}`)
    )
  mongoose
    .connect(`${process.env.MONGO_URI}@${process.env.MONGO_DATABASE_NAME}`)
    .then(() => {
      console.log(
        color(
          'text',
          `🍃 MongoDB connection has been ${color('variable', 'established')}`
        )
      )
    })
    .catch(() => {
      console.log(
        color(
          'text',
          `🍃 MongoDB connection has been ${color('error', 'failed')}`
        )
      )
      setTimeout(() => {
        console.log(
          color(
            'text',
            `🍃 Try ${color('variable', 'reconnecting')} to MongoDB`
          )
        )
        initalizeMongoDB()
      }, 5000)
    })
}
