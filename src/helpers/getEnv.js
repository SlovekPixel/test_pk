import { config } from 'dotenv'

export default function getEnv(key, defaultValue = undefined) {
    const envs = config().parsed
    const value = envs[key]
    if (!value && defaultValue === undefined) throw new Error(`Environment variable ${key} is required but not set.`)

    return value || defaultValue
}