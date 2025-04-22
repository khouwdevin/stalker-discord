import pino from 'pino'

const formatDate = (): string => {
  const date = new Date()

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'trace',
  transport: { target: 'pino-pretty', options: { colorize: true } },
  timestamp: formatDate,
})

export default logger
