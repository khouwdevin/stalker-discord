import { ShardingManager } from 'discord.js'
import { forLavalinkServer } from './functions'
import commandLineArgs from 'command-line-args'
import dotenv from 'dotenv'
import path from 'path'
import logger from './logger'

const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue: 'development',
    type: String,
  },
])

try {
  if (options.env === 'production') {
    dotenv.config()
  } else {
    dotenv.config({
      path: path.join(__dirname, `../development.env`),
    })
  }
} catch (e) {
  throw e
}

;(async () => {
  try {
    if (process.env.TURN_ON_MUSIC === 'true') await forLavalinkServer()

    const shardingManager = new ShardingManager('./build/pre-start.js', {
      token: process.env.TOKEN,
      totalShards: 'auto',
    })

    shardingManager.on('shardCreate', (shard) => {
      logger.info(`[Shard]: 🤖 Launched sharding manager ${shard.id} shard`)
    })

    await shardingManager.spawn()
  } catch (e) {
    logger.error(`[Shard]: ❌ Launched sharding manager error :  ${e.message}`)
  }
})()
