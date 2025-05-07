import pino from 'pino'

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      colorizeObject: true,
      translateTime: 'UTC:yyyy/mm/dd HH:MM:ss',
    },
  },
})

export default logger
