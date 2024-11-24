import axios from 'axios'
import getEnv from '../helpers/getEnv.js'


const API_URL = getEnv("API_URL")

/**
 * Функция получения клиентов:
 * 1. Если регистрация успешна, возвращает токен из регистрации.
 * 2. Если пользователь существует, выполняет логин.
 */
export const fetchClients = async (token, limit, offset) => {
    const response = await axios.get(`${API_URL}/clients`, {
        headers: { Authorization: token },
        params: {
            limit,
            offset
        },
    })
    return response.data
}

export const fetchStatuses = async (token, userIds) => {
    const response = await axios.post(
        `${API_URL}/clients`,
        { userIds },
        { headers: { Authorization: token } }
    )
    return response.data
}
