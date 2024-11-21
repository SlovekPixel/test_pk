import config from "dotenv/config.js";

require('dotenv').config();
const axios = require('axios');
const { google } = require('googleapis');



const API_BASE_URL = process.env.API_BASE_URL;

// Регистрация нового пользователя
async function registerUser(username) {
    const response = await axios.post(`${API_BASE_URL}/auth/registration`, { username });
    console.log('Пользователь зарегистрирован:', response.data);
}

// Авторизация и получение токена
async function loginUser(username) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username });
    return response.data.token;
}

// Получение списка клиентов
async function fetchClients(token, limit = 100, offset = 0) {
    const response = await axios.get(`${API_BASE_URL}/clients`, {
        headers: { Authorization: token },
        params: { limit, offset },
    });
    return response.data;
}

// Получение статусов клиентов
async function fetchStatuses(token, userIds) {
    const response = await axios.post(
        `${API_BASE_URL}/clients`,
        { userIds },
        { headers: { Authorization: token } }
    );
    return response.data;
}

// Экспорт данных в Google Таблицу
async function exportToGoogleSheet(data) {
    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const rows = data.map(client => [
        client.id,
        client.firstName,
        client.lastName,
        client.gender,
        client.address,
        client.city,
        client.phone,
        client.email,
        client.status,
    ]);

    await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: {
            values: [['ID', 'First Name', 'Last Name', 'Gender', 'Address', 'City', 'Phone', 'Email', 'Status'], ...rows],
        },
    });

    console.log('Данные успешно экспортированы в Google Таблицу.');
}

// Основная функция
(async () => {
    try {
        const username = `user_${Date.now()}`; // Уникальное имя пользователя
        await registerUser(username);

        const token = await loginUser(username);
        console.log('Получен токен:', token);

        const limit = 100; // Максимальное количество записей за раз
        let offset = 0;
        let allClients = [];

        // Загружаем данные с сервера по частям
        while (true) {
            const clients = await fetchClients(token, limit, offset);
            if (clients.length === 0) break;

            allClients = allClients.concat(clients);
            offset += limit;
        }

        console.log(`Загружено клиентов: ${allClients.length}`);

        // Получение статусов для всех клиентов
        const userIds = allClients.map(client => client.id);
        const statuses = await fetchStatuses(token, userIds);

        // Объединяем данные клиентов со статусами
        const data = allClients.map(client => ({
            ...client,
            status: statuses.find(status => status.userId === client.id)?.status || 'Unknown',
        }));

        // Экспорт в Google Таблицу
        await exportToGoogleSheet(data);

    } catch (error) {
        console.error('Ошибка:', error.message);
    }
})();