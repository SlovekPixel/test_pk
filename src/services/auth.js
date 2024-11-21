import axios from 'axios'
import getEnv from '../helpers/getEnv.js'


const API_URL = getEnv("API_URL")

/** Регистрирует пользователя. */
const registerUser = async (username) => {
    try {
        const response = await axios.post(`${API_URL}/auth/registration`, { username })
        if (response.status === 201) {
            console.log('Пользователь успешно создан.')
            return response.data
        }
    } catch (error) {
        if (error.response?.status === 400) {
            console.log('Пользователь уже существует.')
            throw new Error('USER_ALREADY_EXISTS')
        }
        throw error
    }
}

/** Выполняет логин пользователя */
const loginUser = async (username) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { username })
        if (response.status === 201) {
            console.log('Пользователь авторизован.')
            return response.data.token
        }
    } catch (error) {
        if (error.response?.status === 400) {
            console.log('Пользователь не найден.')
            throw new Error('USER_NOT_FOUND')
        }
        throw error
    }
}

/**
 * Функция авторизации:
 * 1. Если регистрация успешна, возвращает токен из регистрации.
 * 2. Если пользователь существует, выполняет логин.
 */
export const authenticateUser = async (username) => {
    try {
        const registrationResponse = await registerUser(username)
        return registrationResponse.token
    } catch (error) {
        if (error.message === 'USER_ALREADY_EXISTS') return await loginUser(username)
        throw error
    }
};