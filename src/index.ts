import { ShardingManager } from 'discord.js'
import { forLavalinkServer, color } from './functions'
import commandLineArgs from 'command-line-args'
import dotenv from 'dotenv'
import path from 'path'

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
      console.log(
        color(
          'text',
          `🤖 Launched sharding manager ${color('variable', shard.id)} shard`
        )
      )
    })

    await shardingManager.spawn()
  } catch (e) {
    console.log(
      color(
        'text',
        `❌ Launched sharding manager error :  ${color('error', e.message)}`
      )
    )
  }
})()
